import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';

/**
 * Get job funnel analytics
 */
export const getJobFunnel = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { jobId } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const funnel = await AnalyticsService.getJobFunnel(jobId, req.user.organizationId);

        res.status(200).json({
            success: true,
            data: funnel,
        });
    }
);

/**
 * Get time-to-hire metrics
 */
export const getTimeToHire = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { jobId } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const metrics = await AnalyticsService.getTimeToHire(jobId, req.user.organizationId);

        res.status(200).json({
            success: true,
            data: metrics,
        });
    }
);

/**
 * Get candidate quality metrics
 */
export const getCandidateQuality = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { jobId } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const metrics = await AnalyticsService.getCandidateQualityMetrics(
            jobId,
            req.user.organizationId
        );

        res.status(200).json({
            success: true,
            data: metrics,
        });
    }
);

/**
 * Get source effectiveness
 */
export const getSourceEffectiveness = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const metrics = await AnalyticsService.getSourceEffectiveness(req.user.organizationId);

        res.status(200).json({
            success: true,
            data: metrics,
        });
    }
);

/**
 * Get skill demand
 */
export const getSkillDemand = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const skills = await AnalyticsService.getSkillDemand(req.user.organizationId);

        res.status(200).json({
            success: true,
            data: skills,
        });
    }
);

/**
 * Get organization overview
 */
export const getOrganizationOverview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const overview = await AnalyticsService.getOrganizationOverview(req.user.organizationId);

        res.status(200).json({
            success: true,
            data: overview,
        });
    }
);

/**
 * Get AI decision logs
 */
export const getAIDecisionLogs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { limit = 100 } = req.query;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const logs = await AnalyticsService.getAIDecisionLogs(
            req.user.organizationId,
            Number(limit)
        );

        res.status(200).json({
            success: true,
            data: logs,
        });
    }
);
