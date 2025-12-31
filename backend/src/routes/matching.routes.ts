import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
    matchCandidatesForJob,
    getMatchExplanation,
} from '../controllers/matching.controller';

const router = Router();
router.use(authenticate);

// Matching endpoints
router.post('/jobs/:jobId/match', authorize('admin', 'recruiter'), matchCandidatesForJob);
router.get('/candidates/:candidateId/jobs/:jobId/explanation', getMatchExplanation);

export default router;
