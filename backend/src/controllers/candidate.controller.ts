import { Request, Response, NextFunction } from 'express';
import Candidate from '../models/mongodb/Candidate';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

/**
 * Get all candidates
 */
export const getCandidates = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const { page = 1, limit = 20, search, skills, experienceMin, experienceMax } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const query: any = { organizationId: req.user.organizationId };

        // Search by name or email
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by skills
        if (skills) {
            const skillArray = typeof skills === 'string' ? skills.split(',') : skills;
            query['skills.name'] = { $in: skillArray };
        }

        // Filter by experience
        if (experienceMin) {
            query.totalExperienceYears = { $gte: Number(experienceMin) };
        }
        if (experienceMax) {
            query.totalExperienceYears = { ...query.totalExperienceYears, $lte: Number(experienceMax) };
        }

        const candidates = await Candidate.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select('-resumeEmbedding'); // Exclude large embedding field

        const total = await Candidate.countDocuments(query);

        res.status(200).json({
            success: true,
            data: candidates,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
            },
        });
    }
);

/**
 * Get candidate by ID
 */
export const getCandidateById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const candidate = await Candidate.findOne({
            _id: id,
            organizationId: req.user.organizationId,
        });

        if (!candidate) {
            throw new AppError('Candidate not found', 404);
        }

        res.status(200).json({
            success: true,
            data: candidate,
        });
    }
);

/**
 * Update candidate
 */
export const updateCandidate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updates = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const candidate = await Candidate.findOneAndUpdate(
            { _id: id, organizationId: req.user.organizationId },
            updates,
            { new: true }
        );

        if (!candidate) {
            throw new AppError('Candidate not found', 404);
        }

        logger.info(`Candidate updated: ${id} by ${req.user.email}`);

        res.status(200).json({
            success: true,
            data: candidate,
        });
    }
);

/**
 * Delete candidate
 */
export const deleteCandidate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const candidate = await Candidate.findOneAndDelete({
            _id: id,
            organizationId: req.user.organizationId,
        });

        if (!candidate) {
            throw new AppError('Candidate not found', 404);
        }

        logger.info(`Candidate deleted: ${id} by ${req.user.email}`);

        res.status(200).json({
            success: true,
            message: 'Candidate deleted successfully',
        });
    }
);

/**
 * Apply candidate to job
 */
export const applyToJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id, jobId } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const candidate = await Candidate.findOne({
            _id: id,
            organizationId: req.user.organizationId,
        });

        if (!candidate) {
            throw new AppError('Candidate not found', 404);
        }

        // Check if already applied
        const alreadyApplied = candidate.appliedJobs.some(
            (job) => job.jobId === jobId
        );

        if (alreadyApplied) {
            throw new AppError('Candidate already applied to this job', 409);
        }

        // Add to applied jobs
        candidate.appliedJobs.push({
            jobId,
            appliedAt: new Date(),
            status: 'applied',
        });

        await candidate.save();

        logger.info(`Candidate ${id} applied to job ${jobId}`);

        res.status(200).json({
            success: true,
            message: 'Application submitted successfully',
        });
    }
);

/**
 * Get candidate applications
 */
export const getCandidateApplications = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const candidate = await Candidate.findOne({
            _id: id,
            organizationId: req.user.organizationId,
        }).select('appliedJobs');

        if (!candidate) {
            throw new AppError('Candidate not found', 404);
        }

        res.status(200).json({
            success: true,
            data: candidate.appliedJobs,
        });
    }
);
