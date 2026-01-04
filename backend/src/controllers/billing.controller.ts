import { Request, Response, NextFunction } from 'express';
import { BillingService, SUBSCRIPTION_PLANS } from '../services/billing.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any,
});

/**
 * Get available plans
 */
export const getPlans = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({
            success: true,
            data: SUBSCRIPTION_PLANS,
        });
    }
);

/**
 * Create subscription
 */
export const createSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { planName } = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const subscription = await BillingService.createSubscription(
            req.user.organizationId,
            planName
        );

        res.status(201).json({
            success: true,
            data: subscription,
        });
    }
);

/**
 * Cancel subscription
 */
export const cancelSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        await BillingService.cancelSubscription(req.user.organizationId);

        res.status(200).json({
            success: true,
            message: 'Subscription will be cancelled at the end of the billing period',
        });
    }
);

/**
 * Get usage stats
 */
export const getUsageStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const stats = await BillingService.getUsageStats(req.user.organizationId);

        res.status(200).json({
            success: true,
            data: stats,
        });
    }
);

/**
 * Stripe webhook handler
 */
export const handleStripeWebhook = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err: any) {
            logger.error('Webhook signature verification failed:', err);
            throw new AppError(`Webhook Error: ${err.message}`, 400);
        }

        await BillingService.handleWebhook(event);

        res.status(200).json({ received: true });
    }
);
