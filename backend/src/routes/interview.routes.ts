import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    startInterview,
    submitAnswer,
    getInterview,
    getInterviews,
} from '../controllers/interview.controller';

const router = Router();
router.use(authenticate);

// Interview endpoints
router.post('/start', startInterview);
router.post('/:id/answer', submitAnswer);
router.get('/:id', getInterview);
router.get('/', getInterviews);

export default router;
