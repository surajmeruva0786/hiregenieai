import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { uploadResume as uploadMiddleware, uploadMultipleResumes as uploadMultipleMiddleware } from '../config/multer';
import {
    uploadResume,
    uploadMultipleResumes,
    getResumeStatus,
    getResumes,
    parseResumeWithAI,
    extractSkillsFromText,
} from '../controllers/resume.controller';

const router = Router();
router.use(authenticate);

// Upload routes
router.post('/upload', authorize('admin', 'recruiter'), uploadMiddleware.single('resume'), uploadResume);
router.post('/bulk-upload', authorize('admin', 'recruiter'), uploadMultipleMiddleware.array('resumes', 50), uploadMultipleResumes);

// AI parsing routes
router.post('/parse', uploadMiddleware.single('resume'), parseResumeWithAI);
router.post('/extract-skills', extractSkillsFromText);

// Status and listing
router.get('/:id/status', getResumeStatus);
router.get('/', getResumes);

export default router;

