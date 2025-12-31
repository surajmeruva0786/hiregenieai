import { Worker, Job } from 'bullmq';
import { NotificationJobData } from '../queues';
import { NotificationService } from '../services/notification.service';
import { query } from '../config/postgres';
import { logger } from '../utils/logger';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
};

export const notificationWorker = new Worker<NotificationJobData>(
    'notification-processing',
    async (job: Job<NotificationJobData>) => {
        const { type, recipientEmail, subject, templateName, templateData, organizationId } = job.data;

        logger.info(`Processing notification: ${type} to ${recipientEmail}`);

        try {
            let success = false;
            let html = '';

            // Generate email content based on template
            switch (templateName) {
                case 'interview_invitation':
                    success = await NotificationService.sendInterviewInvitation(
                        recipientEmail,
                        templateData.candidateName,
                        templateData.jobTitle,
                        templateData.interviewLink
                    );
                    break;

                case 'application_status':
                    success = await NotificationService.sendApplicationStatusUpdate(
                        recipientEmail,
                        templateData.candidateName,
                        templateData.jobTitle,
                        templateData.status,
                        templateData.message
                    );
                    break;

                case 'interview_results':
                    success = await NotificationService.sendInterviewResults(
                        recipientEmail,
                        templateData.candidateName,
                        templateData.jobTitle,
                        templateData.score,
                        templateData.feedback
                    );
                    break;

                case 'recruiter_notification':
                    success = await NotificationService.sendRecruiterNotification(
                        recipientEmail,
                        subject,
                        templateData.message
                    );
                    break;

                default:
                    // Generic email
                    success = await NotificationService.sendEmail({
                        to: recipientEmail,
                        subject,
                        html: templateData.html || templateData.message,
                    });
            }

            // Log notification in database
            await query(
                `INSERT INTO notifications (organization_id, type, channel, recipient_email, subject, template_name, template_data, status, sent_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    organizationId,
                    type,
                    'email',
                    recipientEmail,
                    subject,
                    templateName,
                    JSON.stringify(templateData),
                    success ? 'sent' : 'failed',
                    success ? new Date() : null,
                ]
            );

            if (success) {
                logger.info(`Notification sent successfully: ${type} to ${recipientEmail}`);
            } else {
                throw new Error('Failed to send notification');
            }

            return { success, recipientEmail };
        } catch (error: any) {
            logger.error(`Notification failed: ${type} to ${recipientEmail}`, error);

            // Log failed notification
            await query(
                `INSERT INTO notifications (organization_id, type, channel, recipient_email, subject, template_name, template_data, status, error_message)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    organizationId,
                    type,
                    'email',
                    recipientEmail,
                    subject,
                    templateName,
                    JSON.stringify(templateData),
                    'failed',
                    error.message,
                ]
            );

            throw error;
        }
    },
    {
        connection,
        concurrency: 10, // Process 10 notifications concurrently
    }
);

notificationWorker.on('completed', (job) => {
    logger.info(`Notification job completed: ${job.id}`);
});

notificationWorker.on('failed', (job, err) => {
    logger.error(`Notification job failed: ${job?.id}`, err);
});

logger.info('Notification worker started');
