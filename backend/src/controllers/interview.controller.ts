import { Request, Response, NextFunction } from 'express';
import { InterviewService } from '../services/interview.service';
import { RealtimeInterviewService } from '../services/realtime-interview.service';
import { VideoMeetingService } from '../services/video-meeting.service';
import { SpeechToTextService } from '../services/speech-to-text.service';
import Interview from '../models/mongodb/Interview';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

/**
 * Start interview
 */
export const startInterview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { jobId, candidateId, interviewType } = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const result = await InterviewService.startInterview(
            jobId,
            candidateId,
            req.user.organizationId,
            interviewType
        );

        res.status(201).json({
            success: true,
            data: result,
        });
    }
);

/**
 * Submit answer
 */
export const submitAnswer = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { questionId, answer, timeSpent } = req.body;

        const result = await InterviewService.submitAnswer(id, questionId, answer, timeSpent);

        res.status(200).json({
            success: true,
            data: result,
        });
    }
);

/**
 * Get interview details
 */
export const getInterview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const interview = await Interview.findOne({
            _id: id,
            organizationId: req.user.organizationId,
        });

        if (!interview) {
            throw new AppError('Interview not found', 404);
        }

        res.status(200).json({
            success: true,
            data: interview,
        });
    }
);

/**
 * Get all interviews
 */
export const getInterviews = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const { jobId, candidateId, status, page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const query: any = { organizationId: req.user.organizationId };
        if (jobId) query.jobId = jobId;
        if (candidateId) query.candidateId = candidateId;
        if (status) query.status = status;

        const interviews = await Interview.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Interview.countDocuments(query);

        res.status(200).json({
            success: true,
            data: interviews,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
            },
        });
    }
);

/**
 * Schedule a meeting for interview
 */
export const scheduleMeeting = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { scheduledTime, createZoomMeeting } = req.body;

        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const interview = await Interview.findOne({
            _id: id,
            organizationId: req.user.organizationId,
        });

        if (!interview) {
            throw new AppError('Interview not found', 404);
        }

        const meetingRoom = await VideoMeetingService.createMeetingRoom(
            id,
            req.user.userId,
            interview.candidateId,
            new Date(scheduledTime),
            createZoomMeeting
        );

        res.status(200).json({
            success: true,
            data: meetingRoom,
        });
    }
);

/**
 * Start real-time interview session
 */
export const startRealtimeInterview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const session = await RealtimeInterviewService.startRealtimeSession(id);

        res.status(200).json({
            success: true,
            data: session,
        });
    }
);

/**
 * Submit voice answer
 */
export const submitVoiceAnswer = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { sessionId, answer, isVoice } = req.body;

        const result = await RealtimeInterviewService.submitRealtimeAnswer(
            sessionId,
            answer,
            isVoice
        );

        res.status(200).json({
            success: true,
            data: result,
        });
    }
);

/**
 * Get interview transcript
 */
export const getTranscript = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const transcript = SpeechToTextService.getTranscript(id);

        if (!transcript) {
            throw new AppError('Transcript not found', 404);
        }

        res.status(200).json({
            success: true,
            data: transcript,
        });
    }
);

/**
 * Generate next question
 */
export const generateNextQuestion = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { sessionId, previousScore } = req.body;

        const question = await RealtimeInterviewService.generateAdaptiveQuestion(
            sessionId,
            previousScore
        );

        res.status(200).json({
            success: true,
            data: { question },
        });
    }
);

/**
 * Get real-time feedback
 */
export const getRealtimeFeedback = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId } = req.params;

        const feedback = await RealtimeInterviewService.getRealtimeFeedback(sessionId);

        res.status(200).json({
            success: true,
            data: feedback,
        });
    }
);
