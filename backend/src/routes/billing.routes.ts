import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
    getPlans,
    createSubscription,
    cancelSubscription,
    getUsageStats,
    handleStripeWebhook,
} from '../controllers/billing.controller';

const router = Router();

// Public webhook endpoint (no auth)
router.post('/webhook', handleStripeWebhook);

// Protected routes
router.use(authenticate);

router.get('/plans', getPlans);
router.post('/subscribe', authorize('admin'), createSubscription);
router.post('/cancel', authorize('admin'), cancelSubscription);
router.get('/usage', getUsageStats);

export default router;
