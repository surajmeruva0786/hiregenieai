import { Request, Response, NextFunction } from 'express';
import { query } from '../config/postgres';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

/**
 * Create a new job
 */
export const createJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            title,
            description,
            department,
            location,
            employmentType,
            experienceMin,
            experienceMax,
            salaryMin,
            salaryMax,
            currency,
            requiredSkills,
            preferredSkills,
            skillWeights,
            interviewRounds,
            cutoffScore,
        } = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        // Validate required fields
        if (!title || !description || !requiredSkills) {
            throw new AppError('Missing required fields', 400);
        }

        const result = await query(
            `INSERT INTO jobs (
        organization_id, created_by, title, description, department, location,
        employment_type, experience_min, experience_max, salary_min, salary_max,
        currency, required_skills, preferred_skills, skill_weights, interview_rounds, cutoff_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
            [
                req.user.organizationId,
                req.user.userId,
                title,
                description,
                department,
                location,
                employmentType,
                experienceMin,
                experienceMax,
                salaryMin,
                salaryMax,
                currency || 'USD',
                JSON.stringify(requiredSkills),
                JSON.stringify(preferredSkills || []),
                JSON.stringify(skillWeights || {}),
                JSON.stringify(interviewRounds || []),
                cutoffScore || 60,
            ]
        );

        logger.info(`Job created: ${title} by ${req.user.email}`);

        res.status(201).json({
            success: true,
            data: result.rows[0],
        });
    }
);

/**
 * Get all jobs for organization
 */
export const getJobs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const { status, page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        let queryText = `
      SELECT j.*, u.first_name, u.last_name 
      FROM jobs j
      LEFT JOIN users u ON j.created_by = u.id
      WHERE j.organization_id = $1
    `;
        const params: any[] = [req.user.organizationId];

        if (status) {
            queryText += ` AND j.status = $${params.length + 1}`;
            params.push(status);
        }

        queryText += ` ORDER BY j.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(Number(limit), offset);

        const result = await query(queryText, params);

        // Get total count
        const countResult = await query(
            'SELECT COUNT(*) FROM jobs WHERE organization_id = $1',
            [req.user.organizationId]
        );

        res.status(200).json({
            success: true,
            data: result.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: parseInt(countResult.rows[0].count),
            },
        });
    }
);

/**
 * Get job by ID
 */
export const getJobById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const result = await query(
            `SELECT j.*, u.first_name, u.last_name 
       FROM jobs j
       LEFT JOIN users u ON j.created_by = u.id
       WHERE j.id = $1 AND j.organization_id = $2`,
            [id, req.user.organizationId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Job not found', 404);
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    }
);

/**
 * Update job
 */
export const updateJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const updates = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        // Build dynamic update query
        const fields = Object.keys(updates);
        const setClause = fields
            .map((field, index) => `${field} = $${index + 3}`)
            .join(', ');
        const values = fields.map((field) => {
            if (typeof updates[field] === 'object') {
                return JSON.stringify(updates[field]);
            }
            return updates[field];
        });

        const result = await query(
            `UPDATE jobs SET ${setClause} 
       WHERE id = $1 AND organization_id = $2 
       RETURNING *`,
            [id, req.user.organizationId, ...values]
        );

        if (result.rows.length === 0) {
            throw new AppError('Job not found', 404);
        }

        logger.info(`Job updated: ${id} by ${req.user.email}`);

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    }
);

/**
 * Delete job
 */
export const deleteJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const result = await query(
            'DELETE FROM jobs WHERE id = $1 AND organization_id = $2 RETURNING id',
            [id, req.user.organizationId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Job not found', 404);
        }

        logger.info(`Job deleted: ${id} by ${req.user.email}`);

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
        });
    }
);

/**
 * Publish job
 */
export const publishJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const result = await query(
            `UPDATE jobs 
       SET status = 'published', published_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND organization_id = $2 
       RETURNING *`,
            [id, req.user.organizationId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Job not found', 404);
        }

        logger.info(`Job published: ${id} by ${req.user.email}`);

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    }
);
