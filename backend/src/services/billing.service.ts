import Stripe from 'stripe';
import { query } from '../config/postgres';
import { logger } from '../utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any,
});

export interface SubscriptionPlan {
    name: string;
    priceId: string;
    features: {
        maxJobs: number;
        maxCandidates: number;
        maxInterviews: number;
        maxResumesPerMonth: number;
        aiInterviews: boolean;
        advancedAnalytics: boolean;
        workflowAutomation: boolean;
        apiAccess: boolean;
    };
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
    free: {
        name: 'Free',
        priceId: '',
        features: {
            maxJobs: 2,
            maxCandidates: 50,
            maxInterviews: 10,
            maxResumesPerMonth: 20,
            aiInterviews: false,
            advancedAnalytics: false,
            workflowAutomation: false,
            apiAccess: false,
        },
    },
    starter: {
        name: 'Starter',
        priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
        features: {
            maxJobs: 10,
            maxCandidates: 500,
            maxInterviews: 100,
            maxResumesPerMonth: 200,
            aiInterviews: true,
            advancedAnalytics: false,
            workflowAutomation: false,
            apiAccess: false,
        },
    },
    professional: {
        name: 'Professional',
        priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
        features: {
            maxJobs: 50,
            maxCandidates: 2000,
            maxInterviews: 500,
            maxResumesPerMonth: 1000,
            aiInterviews: true,
            advancedAnalytics: true,
            workflowAutomation: true,
            apiAccess: false,
        },
    },
    enterprise: {
        name: 'Enterprise',
        priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
        features: {
            maxJobs: -1, // Unlimited
            maxCandidates: -1,
            maxInterviews: -1,
            maxResumesPerMonth: -1,
            aiInterviews: true,
            advancedAnalytics: true,
            workflowAutomation: true,
            apiAccess: true,
        },
    },
};

export class BillingService {
    /**
     * Create Stripe customer
     */
    static async createCustomer(
        email: string,
        organizationName: string,
        organizationId: string
    ): Promise<string> {
        const customer = await stripe.customers.create({
            email,
            name: organizationName,
            metadata: {
                organizationId,
            },
        });

        // Update organization with Stripe customer ID
        await query(
            'UPDATE organizations SET stripe_customer_id = $1 WHERE id = $2',
            [customer.id, organizationId]
        );

        logger.info(`Stripe customer created: ${customer.id}`);
        return customer.id;
    }

    /**
     * Create subscription
     */
    static async createSubscription(
        organizationId: string,
        planName: string
    ): Promise<any> {
        const plan = SUBSCRIPTION_PLANS[planName];
        if (!plan || !plan.priceId) {
            throw new Error('Invalid plan');
        }

        // Get organization
        const orgResult = await query(
            'SELECT * FROM organizations WHERE id = $1',
            [organizationId]
        );

        if (orgResult.rows.length === 0) {
            throw new Error('Organization not found');
        }

        const org = orgResult.rows[0];
        let customerId = org.stripe_customer_id;

        // Create customer if doesn't exist
        if (!customerId) {
            customerId = await this.createCustomer(
                org.email,
                org.name,
                organizationId
            );
        }

        // Create subscription
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: plan.priceId }],
            metadata: {
                organizationId,
                planName,
            },
        });

        // Save subscription to database
        await query(
            `INSERT INTO subscriptions (organization_id, plan_name, stripe_subscription_id, status, current_period_start, current_period_end)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (organization_id) 
       DO UPDATE SET 
         plan_name = $2,
         stripe_subscription_id = $3,
         status = $4,
         current_period_start = $5,
         current_period_end = $6`,
            [
                organizationId,
                planName,
                subscription.id,
                subscription.status,
                new Date(subscription.current_period_start * 1000),
                new Date(subscription.current_period_end * 1000),
            ]
        );

        // Update organization subscription plan
        await query(
            'UPDATE organizations SET subscription_plan = $1, subscription_status = $2 WHERE id = $3',
            [planName, subscription.status, organizationId]
        );

        logger.info(`Subscription created: ${subscription.id} for ${organizationId}`);
        return subscription;
    }

    /**
     * Cancel subscription
     */
    static async cancelSubscription(organizationId: string): Promise<void> {
        const subResult = await query(
            'SELECT * FROM subscriptions WHERE organization_id = $1',
            [organizationId]
        );

        if (subResult.rows.length === 0) {
            throw new Error('No subscription found');
        }

        const sub = subResult.rows[0];

        // Cancel at period end
        await stripe.subscriptions.update(sub.stripe_subscription_id, {
            cancel_at_period_end: true,
        });

        await query(
            'UPDATE subscriptions SET cancel_at_period_end = true WHERE organization_id = $1',
            [organizationId]
        );

        logger.info(`Subscription cancelled: ${sub.stripe_subscription_id}`);
    }

    /**
     * Track usage
     */
    static async trackUsage(
        organizationId: string,
        resourceType: string,
        count: number = 1
    ): Promise<void> {
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        await query(
            `INSERT INTO usage_tracking (organization_id, resource_type, resource_count, period_start, period_end)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (organization_id, resource_type, period_start)
       DO UPDATE SET resource_count = usage_tracking.resource_count + $3`,
            [organizationId, resourceType, count, periodStart, periodEnd]
        );
    }

    /**
     * Get usage stats
     */
    static async getUsageStats(organizationId: string): Promise<any> {
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const result = await query(
            `SELECT resource_type, resource_count 
       FROM usage_tracking 
       WHERE organization_id = $1 AND period_start = $2`,
            [organizationId, periodStart]
        );

        const usage = result.rows.reduce((acc: any, row) => {
            acc[row.resource_type] = parseInt(row.resource_count);
            return acc;
        }, {});

        // Get plan limits
        const orgResult = await query(
            'SELECT subscription_plan FROM organizations WHERE id = $1',
            [organizationId]
        );

        const plan = SUBSCRIPTION_PLANS[orgResult.rows[0]?.subscription_plan || 'free'];

        return {
            usage,
            limits: plan.features,
            periodStart,
        };
    }

    /**
     * Check if feature is available
     */
    static async checkFeatureAccess(
        organizationId: string,
        feature: string
    ): Promise<boolean> {
        const orgResult = await query(
            'SELECT subscription_plan FROM organizations WHERE id = $1',
            [organizationId]
        );

        const planName = orgResult.rows[0]?.subscription_plan || 'free';
        const plan = SUBSCRIPTION_PLANS[planName];

        return (plan.features as any)[feature] === true;
    }

    /**
     * Check usage limit
     */
    static async checkUsageLimit(
        organizationId: string,
        resourceType: string
    ): Promise<boolean> {
        const stats = await this.getUsageStats(organizationId);
        const currentUsage = stats.usage[resourceType] || 0;
        const limit = (stats.limits as any)[`max${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`];

        if (limit === -1) return true; // Unlimited
        return currentUsage < limit;
    }

    /**
     * Handle Stripe webhook
     */
    static async handleWebhook(event: Stripe.Event): Promise<void> {
        switch (event.type) {
            case 'customer.subscription.updated':
            case 'customer.subscription.created':
                await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            case 'invoice.payment_succeeded':
                await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            default:
                logger.info(`Unhandled webhook event: ${event.type}`);
        }
    }

    /**
     * Handle subscription update
     */
    private static async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
        const organizationId = subscription.metadata.organizationId;

        await query(
            `UPDATE subscriptions 
       SET status = $1, current_period_start = $2, current_period_end = $3
       WHERE stripe_subscription_id = $4`,
            [
                subscription.status,
                new Date(subscription.current_period_start * 1000),
                new Date(subscription.current_period_end * 1000),
                subscription.id,
            ]
        );

        await query(
            'UPDATE organizations SET subscription_status = $1 WHERE id = $2',
            [subscription.status, organizationId]
        );

        logger.info(`Subscription updated: ${subscription.id}`);
    }

    /**
     * Handle subscription deleted
     */
    private static async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
        const organizationId = subscription.metadata.organizationId;

        await query(
            'UPDATE organizations SET subscription_plan = $1, subscription_status = $2 WHERE id = $3',
            ['free', 'cancelled', organizationId]
        );

        logger.info(`Subscription deleted: ${subscription.id}`);
    }

    /**
     * Handle payment succeeded
     */
    private static async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
        logger.info(`Payment succeeded: ${invoice.id}`);
    }

    /**
     * Handle payment failed
     */
    private static async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
        logger.error(`Payment failed: ${invoice.id}`);
    }
}
