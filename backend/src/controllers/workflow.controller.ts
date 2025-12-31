import { Request, Response, NextFunction } from 'express';
import { WorkflowService } from '../services/workflow.service';
import { query } from '../config/postgres';
import { AppError, asyncHandler } from '../middleware/error.middleware';

/**
 * Create workflow
 */
export const createWorkflow = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, description, trigger, conditions, actions } = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const workflow = await WorkflowService.createWorkflow(
            req.user.organizationId,
            name,
            description,
            trigger,
            conditions || [],
            actions,
            req.user.userId
        );

        res.status(201).json({
            success: true,
            data: workflow,
        });
    }
);

/**
 * Get all workflows
 */
export const getWorkflows = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const result = await query(
            'SELECT * FROM workflows WHERE organization_id = $1 ORDER BY created_at DESC',
            [req.user.organizationId]
        );

        res.status(200).json({
            success: true,
            data: result.rows,
        });
    }
);

/**
 * Update workflow
 */
export const updateWorkflow = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { name, description, trigger, conditions, actions, isActive } = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const result = await query(
            `UPDATE workflows 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           trigger_type = COALESCE($3, trigger_type),
           trigger_config = COALESCE($4, trigger_config),
           conditions = COALESCE($5, conditions),
           actions = COALESCE($6, actions),
           is_active = COALESCE($7, is_active)
       WHERE id = $8 AND organization_id = $9
       RETURNING *`,
            [
                name,
                description,
                trigger?.type,
                trigger?.config ? JSON.stringify(trigger.config) : null,
                conditions ? JSON.stringify(conditions) : null,
                actions ? JSON.stringify(actions) : null,
                isActive,
                id,
                req.user.organizationId,
            ]
        );

        if (result.rows.length === 0) {
            throw new AppError('Workflow not found', 404);
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    }
);

/**
 * Delete workflow
 */
export const deleteWorkflow = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const result = await query(
            'DELETE FROM workflows WHERE id = $1 AND organization_id = $2 RETURNING id',
            [id, req.user.organizationId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Workflow not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Workflow deleted successfully',
        });
    }
);
