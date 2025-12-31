import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
    getCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
    applyToJob,
    getCandidateApplications,
} from '../controllers/candidate.controller';

const router = Router();
router.use(authenticate);

// Candidate CRUD
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', authorize('admin', 'recruiter'), updateCandidate);
router.delete('/:id', authorize('admin', 'recruiter'), deleteCandidate);

// Applications
router.post('/:id/apply/:jobId', authorize('admin', 'recruiter'), applyToJob);
router.get('/:id/applications', getCandidateApplications);

export default router;
