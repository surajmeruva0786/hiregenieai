import { Router } from 'express';
import authRoutes from './auth.routes';
import jobRoutes from './job.routes';
import candidateRoutes from './candidate.routes';
import resumeRoutes from './resume.routes';
import interviewRoutes from './interview.routes';
import matchingRoutes from './matching.routes';
import pipelineRoutes from './pipeline.routes';
import workflowRoutes from './workflow.routes';
import analyticsRoutes from './analytics.routes';
import billingRoutes from './billing.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/candidates', candidateRoutes);
router.use('/resumes', resumeRoutes);
router.use('/interviews', interviewRoutes);
router.use('/matching', matchingRoutes);
router.use('/pipeline', pipelineRoutes);
router.use('/workflows', workflowRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/billing', billingRoutes);

export default router;
