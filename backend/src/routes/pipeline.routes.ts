import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
    moveCandidateToStage,
    getJobPipeline,
    bulkMoveCandidates,
} from '../controllers/pipeline.controller';

const router = Router();
router.use(authenticate);

// Pipeline management
router.post('/move', authorize('admin', 'recruiter'), moveCandidateToStage);
router.post('/bulk-move', authorize('admin', 'recruiter'), bulkMoveCandidates);
router.get('/jobs/:jobId', getJobPipeline);

export default router;
