import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export interface EmailData {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export class NotificationService {
    /**
     * Send email notification
     */
    static async sendEmail(data: EmailData): Promise<boolean> {
        try {
            const msg = {
                to: data.to,
                from: data.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@hiregenie.ai',
                subject: data.subject,
                html: data.html,
            };

            await sgMail.send(msg);
            logger.info(`Email sent to ${data.to}: ${data.subject}`);
            return true;
        } catch (error) {
            logger.error('Email sending failed:', error);
            return false;
        }
    }

    /**
     * Send interview invitation
     */
    static async sendInterviewInvitation(
        candidateEmail: string,
        candidateName: string,
        jobTitle: string,
        interviewLink: string
    ): Promise<boolean> {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Interview Invitation</h2>
        <p>Dear ${candidateName},</p>
        <p>Congratulations! You have been selected for an interview for the position of <strong>${jobTitle}</strong>.</p>
        <p>Please click the link below to start your AI-powered interview:</p>
        <a href="${interviewLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Start Interview</a>
        <p>The interview will consist of several questions designed to assess your skills and experience. Please ensure you have a stable internet connection.</p>
        <p>Good luck!</p>
        <p style="color: #666; font-size: 14px; margin-top: 40px;">Best regards,<br>HireGenie AI Team</p>
      </div>
    `;

        return this.sendEmail({
            to: candidateEmail,
            subject: `Interview Invitation - ${jobTitle}`,
            html,
        });
    }

    /**
     * Send application status update
     */
    static async sendApplicationStatusUpdate(
        candidateEmail: string,
        candidateName: string,
        jobTitle: string,
        status: string,
        message?: string
    ): Promise<boolean> {
        const statusMessages: any = {
            shortlisted: 'Your application has been shortlisted!',
            interview_scheduled: 'Your interview has been scheduled.',
            offer: 'Congratulations! We would like to extend an offer.',
            rejected: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.',
        };

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Application Status Update</h2>
        <p>Dear ${candidateName},</p>
        <p>We have an update regarding your application for <strong>${jobTitle}</strong>.</p>
        <p style="font-size: 16px; font-weight: bold; color: #1F2937;">${statusMessages[status] || 'Status updated'}</p>
        ${message ? `<p>${message}</p>` : ''}
        <p style="color: #666; font-size: 14px; margin-top: 40px;">Best regards,<br>HireGenie AI Team</p>
      </div>
    `;

        return this.sendEmail({
            to: candidateEmail,
            subject: `Application Update - ${jobTitle}`,
            html,
        });
    }

    /**
     * Send interview results
     */
    static async sendInterviewResults(
        candidateEmail: string,
        candidateName: string,
        jobTitle: string,
        score: number,
        feedback: string
    ): Promise<boolean> {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Interview Results</h2>
        <p>Dear ${candidateName},</p>
        <p>Thank you for completing the interview for <strong>${jobTitle}</strong>.</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Your Score:</strong> ${score}%</p>
          <p style="margin-top: 10px;"><strong>Feedback:</strong></p>
          <p style="margin: 10px 0;">${feedback}</p>
        </div>
        <p>We will review your results and get back to you soon regarding the next steps.</p>
        <p style="color: #666; font-size: 14px; margin-top: 40px;">Best regards,<br>HireGenie AI Team</p>
      </div>
    `;

        return this.sendEmail({
            to: candidateEmail,
            subject: `Interview Results - ${jobTitle}`,
            html,
        });
    }

    /**
     * Send recruiter notification
     */
    static async sendRecruiterNotification(
        recruiterEmail: string,
        subject: string,
        message: string
    ): Promise<boolean> {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">HireGenie AI Notification</h2>
        <p>${message}</p>
        <p style="color: #666; font-size: 14px; margin-top: 40px;">HireGenie AI Platform</p>
      </div>
    `;

        return this.sendEmail({
            to: recruiterEmail,
            subject,
            html,
        });
    }

    /**
     * Send bulk notifications
     */
    static async sendBulkEmails(emails: EmailData[]): Promise<number> {
        let successCount = 0;

        for (const email of emails) {
            const success = await this.sendEmail(email);
            if (success) successCount++;
        }

        return successCount;
    }
}
