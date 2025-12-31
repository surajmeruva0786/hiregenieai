import { Worker, Job } from 'bullmq';
import { ResumeJobData } from '../queues';
import Resume from '../models/mongodb/Resume';
import Candidate from '../models/mongodb/Candidate';
import { ResumeParserService } from '../services/parser.service';
import { SkillExtractionService } from '../services/skill-extraction.service';
import { EmbeddingService } from '../services/embedding.service';
import { logger } from '../utils/logger';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
};

export const resumeWorker = new Worker<ResumeJobData>(
    'resume-processing',
    async (job: Job<ResumeJobData>) => {
        const { resumeId, organizationId, filePath, fileUrl, originalFilename, uploadedBy, jobId } = job.data;

        logger.info(`Processing resume: ${resumeId}`);

        try {
            // Update status to processing
            await Resume.findByIdAndUpdate(resumeId, {
                status: 'processing',
                processingStartedAt: new Date(),
            });

            // Step 1: Parse resume
            logger.info(`Parsing resume file: ${originalFilename}`);
            const fileType = originalFilename.endsWith('.pdf')
                ? 'application/pdf'
                : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

            const rawText = await ResumeParserService.parseResume(filePath, fileType);
            const cleanedText = ResumeParserService.cleanText(rawText);

            // Step 2: Extract personal information
            logger.info('Extracting personal information');
            const personalInfo = await SkillExtractionService.extractPersonalInfo(cleanedText);

            // Step 3: Extract skills
            logger.info('Extracting skills');
            const skills = await SkillExtractionService.extractSkills(cleanedText);

            // Step 4: Extract experience
            logger.info('Extracting experience');
            const experience = await SkillExtractionService.extractExperience(cleanedText);

            // Step 5: Extract education
            logger.info('Extracting education');
            const education = await SkillExtractionService.extractEducation(cleanedText);

            // Step 6: Extract projects
            logger.info('Extracting projects');
            const projects = await SkillExtractionService.extractProjects(cleanedText);

            // Step 7: Calculate total experience
            const sections = ResumeParserService.detectSections(cleanedText);
            const totalExperienceYears = sections.experience
                ? ResumeParserService.calculateExperience(sections.experience)
                : 0;

            // Step 8: Generate embedding
            logger.info('Generating resume embedding');
            const embedding = await EmbeddingService.generateEmbedding(cleanedText);

            // Step 9: Update resume document
            await Resume.findByIdAndUpdate(resumeId, {
                rawText: cleanedText,
                parsedData: {
                    personalInfo,
                    skills: skills.map(s => s.name),
                    experience: experience.map(exp => ({
                        company: exp.company,
                        title: exp.title,
                        duration: `${exp.startDate} - ${exp.endDate || 'Present'}`,
                        description: exp.description,
                    })),
                    education: education.map(edu => ({
                        institution: edu.institution,
                        degree: edu.degree,
                        field: edu.field,
                        year: edu.endDate,
                    })),
                    projects: projects.map(proj => ({
                        title: proj.title,
                        description: proj.description,
                        technologies: proj.technologies,
                    })),
                },
                status: 'completed',
                processingCompletedAt: new Date(),
            });

            // Step 10: Create or update candidate profile
            logger.info('Creating candidate profile');

            const candidateData = {
                organizationId,
                email: personalInfo.email || 'unknown@example.com',
                firstName: personalInfo.name?.split(' ')[0] || 'Unknown',
                lastName: personalInfo.name?.split(' ').slice(1).join(' ') || '',
                phone: personalInfo.phone,
                location: personalInfo.location,
                resumeUrl: fileUrl,
                resumeId,
                skills: skills.map(s => ({
                    name: s.name,
                    confidence: s.confidence,
                    source: 'extracted' as const,
                })),
                experience: experience.map(exp => ({
                    company: exp.company,
                    title: exp.title,
                    startDate: new Date(exp.startDate),
                    endDate: exp.endDate ? new Date(exp.endDate) : undefined,
                    isCurrent: exp.isCurrent,
                    description: exp.description,
                    skills: exp.skills || [],
                })),
                education: education.map(edu => ({
                    institution: edu.institution,
                    degree: edu.degree,
                    field: edu.field,
                    startDate: edu.startDate ? new Date(edu.startDate) : undefined,
                    endDate: edu.endDate ? new Date(edu.endDate) : undefined,
                    grade: edu.grade,
                })),
                projects: projects.map(proj => ({
                    title: proj.title,
                    description: proj.description,
                    technologies: proj.technologies || [],
                    url: proj.url,
                })),
                totalExperienceYears,
                resumeEmbedding: embedding,
                embeddingModel: 'embedding-001',
                source: 'upload' as const,
            };

            // Check if candidate already exists
            let candidate = await Candidate.findOne({
                organizationId,
                email: candidateData.email,
            });

            if (candidate) {
                // Update existing candidate
                await Candidate.findByIdAndUpdate(candidate._id, candidateData);
                logger.info(`Updated existing candidate: ${candidate._id}`);
            } else {
                // Create new candidate
                candidate = await Candidate.create(candidateData);
                logger.info(`Created new candidate: ${candidate._id}`);
            }

            // If jobId provided, add to applied jobs
            if (jobId && candidate) {
                await Candidate.findByIdAndUpdate(candidate._id, {
                    $addToSet: {
                        appliedJobs: {
                            jobId,
                            appliedAt: new Date(),
                            status: 'applied',
                        },
                    },
                });
            }

            logger.info(`Resume processing completed: ${resumeId}`);

            return {
                success: true,
                resumeId,
                candidateId: candidate._id.toString(),
            };
        } catch (error: any) {
            logger.error(`Resume processing failed: ${resumeId}`, error);

            // Update resume status to failed
            await Resume.findByIdAndUpdate(resumeId, {
                status: 'failed',
                errorMessage: error.message,
            });

            throw error;
        }
    },
    {
        connection,
        concurrency: 5, // Process 5 resumes concurrently
    }
);

resumeWorker.on('completed', (job) => {
    logger.info(`Resume job completed: ${job.id}`);
});

resumeWorker.on('failed', (job, err) => {
    logger.error(`Resume job failed: ${job?.id}`, err);
});

logger.info('Resume worker started');
