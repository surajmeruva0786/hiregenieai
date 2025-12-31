import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
    getJobFunnel,
    getTimeToHire,
    getCandidateQuality,
    getSourceEffectiveness,
    getSkillDemand,
    getOrganizationOverview,
    getAIDecisionLogs,
} from '../controllers/analytics.controller';

const router = Router();
router.use(authenticate);

// Analytics endpoints
router.get('/overview', getOrganizationOverview);
router.get('/jobs/:jobId/funnel', getJobFunnel);
router.get('/jobs/:jobId/time-to-hire', getTimeToHire);
router.get('/jobs/:jobId/quality', getCandidateQuality);
router.get('/sources', getSourceEffectiveness);
router.get('/skills/demand', getSkillDemand);
router.get('/ai-decisions', authorize('admin', 'recruiter'), getAIDecisionLogs);

export default router;
