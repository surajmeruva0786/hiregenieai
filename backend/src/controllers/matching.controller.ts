import { Request, Response, NextFunction } from 'express';
import { MatchingService } from '../services/matching.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

/**
 * Match candidates for a job
 */
export const matchCandidatesForJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { jobId } = req.params;
        const { limit = 50 } = req.query;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        logger.info(`Matching candidates for job: ${jobId}`);

        const matches = await MatchingService.matchCandidatesForJob(
            jobId,
            req.user.organizationId,
            Number(limit)
        );

        res.status(200).json({
            success: true,
            data: matches,
        });
    }
);

/**
 * Get match explanation for candidate-job pair
 */
export const getMatchExplanation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { candidateId, jobId } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const explanation = await MatchingService.getMatchExplanation(
            candidateId,
            jobId,
            req.user.organizationId
        );

        res.status(200).json({
            success: true,
            data: explanation,
        });
    }
);
