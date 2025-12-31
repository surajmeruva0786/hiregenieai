import { Queue, Worker, Job } from 'bullmq';
import redisClient from '../config/redis';
import { logger } from '../utils/logger';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
};

// Resume processing queue
export const resumeQueue = new Queue('resume-processing', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
        },
        removeOnFail: {
            count: 50, // Keep last 50 failed jobs
        },
    },
});

// Interview queue
export const interviewQueue = new Queue('interview-processing', {
    connection,
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    },
});

// Notification queue
export const notificationQueue = new Queue('notification-processing', {
    connection,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    },
});

// Workflow queue
export const workflowQueue = new Queue('workflow-processing', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
    },
});

logger.info('BullMQ queues initialized');

export interface ResumeJobData {
    resumeId: string;
    organizationId: string;
    filePath: string;
    fileUrl: string;
    originalFilename: string;
    uploadedBy?: string;
    jobId?: string;
}

export interface InterviewJobData {
    interviewId: string;
    candidateId: string;
    jobId: string;
    organizationId: string;
}

export interface NotificationJobData {
    type: string;
    recipientEmail: string;
    subject: string;
    templateName: string;
    templateData: any;
    organizationId: string;
}

export interface WorkflowJobData {
    workflowId: string;
    triggerData: any;
    organizationId: string;
}
