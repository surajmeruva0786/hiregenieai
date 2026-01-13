import { Request, Response, NextFunction } from 'express';
import path from 'path';
import Resume from '../models/mongodb/Resume';
import { resumeQueue } from '../queues';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';
import { ResumeParserService } from '../services/parser.service';
import { SkillExtractionService } from '../services/skill-extraction.service';
import { EmbeddingService } from '../services/embedding.service';

/**
 * Upload single resume
 */
export const uploadResume = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        if (!req.file) {
            throw new AppError('No file uploaded', 400);
        }

        const { jobId } = req.body;

        // Create resume document
        const resume = await Resume.create({
            organizationId: req.user.organizationId,
            originalFilename: req.file.originalname,
            fileUrl: `/uploads/resumes/${req.file.filename}`,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            status: 'pending',
            uploadedBy: req.user.userId,
        });

        // Add to processing queue
        await resumeQueue.add('process-resume', {
            resumeId: resume._id.toString(),
            organizationId: req.user.organizationId,
            filePath: req.file.path,
            fileUrl: `/uploads/resumes/${req.file.filename}`,
            originalFilename: req.file.originalname,
            uploadedBy: req.user.userId,
            jobId,
        });

        logger.info(`Resume uploaded and queued: ${resume._id}`);

        res.status(201).json({
            success: true,
            data: {
                resumeId: resume._id,
                status: 'pending',
                message: 'Resume uploaded successfully and queued for processing',
            },
        });
    }
);

/**
 * Upload multiple resumes (bulk upload)
 */
export const uploadMultipleResumes = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw new AppError('No files uploaded', 400);
        }

        const { jobId } = req.body;
        const resumeIds: string[] = [];

        // Create resume documents and queue jobs
        for (const file of req.files) {
            const resume = await Resume.create({
                organizationId: req.user.organizationId,
                originalFilename: file.originalname,
                fileUrl: `/uploads/resumes/${file.filename}`,
                fileSize: file.size,
                fileType: file.mimetype,
                status: 'pending',
                uploadedBy: req.user.userId,
            });

            await resumeQueue.add('process-resume', {
                resumeId: resume._id.toString(),
                organizationId: req.user.organizationId,
                filePath: file.path,
                fileUrl: `/uploads/resumes/${file.filename}`,
                originalFilename: file.originalname,
                uploadedBy: req.user.userId,
                jobId,
            });

            resumeIds.push(resume._id.toString());
        }

        logger.info(`${req.files.length} resumes uploaded and queued`);

        res.status(201).json({
            success: true,
            data: {
                count: req.files.length,
                resumeIds,
                message: `${req.files.length} resumes uploaded and queued for processing`,
            },
        });
    }
);

/**
 * Get resume processing status
 */
export const getResumeStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const resume = await Resume.findOne({
            _id: id,
            organizationId: req.user.organizationId,
        });

        if (!resume) {
            throw new AppError('Resume not found', 404);
        }

        res.status(200).json({
            success: true,
            data: {
                resumeId: resume._id,
                status: resume.status,
                originalFilename: resume.originalFilename,
                uploadedAt: resume.uploadedAt,
                processingStartedAt: resume.processingStartedAt,
                processingCompletedAt: resume.processingCompletedAt,
                errorMessage: resume.errorMessage,
                candidateId: resume.candidateId,
            },
        });
    }
);

/**
 * Get all resumes for organization
 */
export const getResumes = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const { status, page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const query: any = { organizationId: req.user.organizationId };
        if (status) {
            query.status = status;
        }

        const resumes = await Resume.find(query)
            .sort({ uploadedAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Resume.countDocuments(query);

        res.status(200).json({
            success: true,
            data: resumes,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
            },
        });
    }
);

/**
 * Parse resume with AI extraction (for direct parsing without upload)
 */
export const parseResumeWithAI = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            throw new AppError('No file uploaded', 400);
        }

        try {
            logger.info(`Starting AI resume parsing for: ${req.file.originalname}`);

            // Parse resume text
            const resumeText = await ResumeParserService.parseResume(
                req.file.path,
                req.file.mimetype
            );

            const cleanedText = ResumeParserService.cleanText(resumeText);

            // Extract data using AI
            const [skills, experience, education, projects, personalInfo] = await Promise.all([
                SkillExtractionService.extractSkills(cleanedText),
                SkillExtractionService.extractExperience(cleanedText),
                SkillExtractionService.extractEducation(cleanedText),
                SkillExtractionService.extractProjects(cleanedText),
                SkillExtractionService.extractPersonalInfo(cleanedText),
            ]);

            // Generate embedding for semantic matching
            let embedding: number[] | null = null;
            try {
                embedding = await EmbeddingService.generateEmbedding(cleanedText);
            } catch (error) {
                logger.warn('Failed to generate embedding:', error);
            }

            // Calculate total experience
            const experienceText = experience.map((e: any) =>
                `${e.title} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'})`
            ).join('\n');

            const totalExperienceYears = ResumeParserService.calculateExperience(experienceText);

            // Extract contact info
            const email = personalInfo.email || ResumeParserService.extractEmail(cleanedText);
            const phone = personalInfo.phone || ResumeParserService.extractPhone(cleanedText);
            const linkedin = personalInfo.linkedin || ResumeParserService.extractLinkedIn(cleanedText);
            const github = personalInfo.github || ResumeParserService.extractGitHub(cleanedText);

            const parsedData = {
                personalInfo: {
                    name: personalInfo.name || 'Unknown',
                    email,
                    phone,
                    location: personalInfo.location,
                    linkedin,
                    github,
                    portfolio: personalInfo.portfolio,
                },
                skills,
                experience,
                education,
                projects,
                totalExperienceYears,
                resumeEmbedding: embedding,
                rawText: cleanedText,
            };

            logger.info(`AI parsing completed successfully for: ${req.file.originalname}`);

            res.status(200).json({
                success: true,
                data: parsedData,
                message: 'Resume parsed successfully with AI',
            });
        } catch (error: any) {
            logger.error('AI resume parsing error:', error);
            throw new AppError(
                `Failed to parse resume: ${error.message}`,
                500
            );
        }
    }
);

/**
 * Extract skills from text (utility endpoint)
 */
export const extractSkillsFromText = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { text } = req.body;

        if (!text) {
            throw new AppError('Text is required', 400);
        }

        try {
            const skills = await SkillExtractionService.extractSkills(text);

            res.status(200).json({
                success: true,
                data: { skills },
            });
        } catch (error: any) {
            logger.error('Skill extraction error:', error);
            throw new AppError(
                `Failed to extract skills: ${error.message}`,
                500
            );
        }
    }
);

