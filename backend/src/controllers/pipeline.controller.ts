import { Request, Response, NextFunction } from 'express';
import { query } from '../config/postgres';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

/**
 * Move candidate to pipeline stage
 */
export const moveCandidateToStage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { jobId, candidateId, stage, notes } = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        // Validate stage
        const validStages = [
            'applied',
            'screening',
            'shortlisted',
            'interview_scheduled',
            'interview_completed',
            'evaluation',
            'offer',
            'hired',
            'rejected',
        ];

        if (!validStages.includes(stage)) {
            throw new AppError('Invalid pipeline stage', 400);
        }

        // Insert pipeline stage record
        const result = await query(
            `INSERT INTO pipeline_stages (job_id, candidate_id, stage, notes, moved_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [jobId, candidateId, stage, notes, req.user.userId]
        );

        logger.info(`Candidate ${candidateId} moved to ${stage} for job ${jobId}`);

        res.status(201).json({
            success: true,
            data: result.rows[0],
        });
    }
);

/**
 * Get pipeline for a job
 */
export const getJobPipeline = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { jobId } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        // Get latest stage for each candidate
        const result = await query(
            `SELECT DISTINCT ON (candidate_id) *
       FROM pipeline_stages
       WHERE job_id = $1
       ORDER BY candidate_id, moved_at DESC`,
            [jobId]
        );

        // Group by stage
        const pipeline: any = {};
        result.rows.forEach((row) => {
            if (!pipeline[row.stage]) {
                pipeline[row.stage] = [];
            }
            pipeline[row.stage].push(row);
        });

        res.status(200).json({
            success: true,
            data: pipeline,
        });
    }
);

/**
 * Bulk move candidates
 */
export const bulkMoveCandidates = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { jobId, candidateIds, stage, notes } = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
            throw new AppError('Candidate IDs must be a non-empty array', 400);
        }

        const results = [];
        for (const candidateId of candidateIds) {
            const result = await query(
                `INSERT INTO pipeline_stages (job_id, candidate_id, stage, notes, moved_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
                [jobId, candidateId, stage, notes, req.user.userId]
            );
            results.push(result.rows[0]);
        }

        logger.info(`Bulk moved ${candidateIds.length} candidates to ${stage}`);

        res.status(201).json({
            success: true,
            data: results,
            message: `${candidateIds.length} candidates moved to ${stage}`,
        });
    }
);
