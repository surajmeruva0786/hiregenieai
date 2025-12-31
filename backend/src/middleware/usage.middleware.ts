import { Request, Response, NextFunction } from 'express';
import { BillingService } from '../services/billing.service';
import { AppError } from './error.middleware';

/**
 * Check if organization has access to a feature
 */
export const checkFeatureAccess = (feature: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError('Unauthorized', 401);
            }

            const hasAccess = await BillingService.checkFeatureAccess(
                req.user.organizationId,
                feature
            );

            if (!hasAccess) {
                throw new AppError(
                    `This feature requires a higher subscription plan. Please upgrade to access ${feature}.`,
                    403
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Check usage limit for a resource
 */
export const checkUsageLimit = (resourceType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError('Unauthorized', 401);
            }

            const withinLimit = await BillingService.checkUsageLimit(
                req.user.organizationId,
                resourceType
            );

            if (!withinLimit) {
                throw new AppError(
                    `You have reached your ${resourceType} limit for this billing period. Please upgrade your plan.`,
                    429
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Track usage after successful request
 */
export const trackUsage = (resourceType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Store original send function
        const originalSend = res.send;

        // Override send function
        res.send = function (data: any) {
            // Track usage if request was successful
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                BillingService.trackUsage(req.user.organizationId, resourceType).catch(
                    (error) => {
                        console.error('Failed to track usage:', error);
                    }
                );
            }

            // Call original send
            return originalSend.call(this, data);
        };

        next();
    };
};
