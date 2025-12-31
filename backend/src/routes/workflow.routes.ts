import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
    createWorkflow,
    getWorkflows,
    updateWorkflow,
    deleteWorkflow,
} from '../controllers/workflow.controller';

const router = Router();
router.use(authenticate);

// Workflow CRUD
router.post('/', authorize('admin', 'recruiter'), createWorkflow);
router.get('/', getWorkflows);
router.put('/:id', authorize('admin', 'recruiter'), updateWorkflow);
router.delete('/:id', authorize('admin', 'recruiter'), deleteWorkflow);

export default router;
