import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    startInterview,
    submitAnswer,
    getInterview,
    getInterviews,
    scheduleMeeting,
    startRealtimeInterview,
    submitVoiceAnswer,
    getTranscript,
    generateNextQuestion,
    getRealtimeFeedback,
} from '../controllers/interview.controller';

const router = Router();
router.use(authenticate);

// Interview endpoints
router.post('/start', startInterview);
router.post('/:id/answer', submitAnswer);
router.get('/:id', getInterview);
router.get('/', getInterviews);

// Real-time interview endpoints
router.post('/:id/schedule-meeting', scheduleMeeting);
router.post('/:id/start-realtime', startRealtimeInterview);
router.post('/:id/submit-voice-answer', submitVoiceAnswer);
router.get('/:id/transcript', getTranscript);
router.post('/:id/generate-next-question', generateNextQuestion);
router.get('/session/:sessionId/feedback', getRealtimeFeedback);

export default router;
