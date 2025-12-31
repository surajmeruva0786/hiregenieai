import { Router } from 'express';
import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    publishJob,
} from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Job CRUD
router.post('/', authorize('admin', 'recruiter'), createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', authorize('admin', 'recruiter'), updateJob);
router.delete('/:id', authorize('admin', 'recruiter'), deleteJob);

// Job actions
router.post('/:id/publish', authorize('admin', 'recruiter'), publishJob);

export default router;
