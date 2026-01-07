import type { Workflow } from '../types';

export const workflowTemplates: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'createdBy'>[] = [
    {
        name: 'Auto-shortlist High Scorers',
        description: 'Automatically move candidates with AI score > 85 to reviewing stage',
        trigger: {
            type: 'application_created',
        },
        conditions: [
            {
                field: 'aiScore',
                operator: 'greater_than',
                value: 85,
            },
        ],
        actions: [
            {
                type: 'update_status',
                config: {
                    status: 'reviewing',
                },
            },
            {
                type: 'send_notification',
                config: {
                    recipient: 'recruiter',
                    message: 'High-scoring candidate {{candidateName}} (Score: {{aiScore}}) has been auto-shortlisted for {{jobTitle}}',
                },
            },
            {
                type: 'add_note',
                config: {
                    note: 'Automatically moved to reviewing stage due to high AI score ({{aiScore}})',
                },
            },
        ],
        status: 'paused',
        lastExecutedAt: undefined,
    },
    {
        name: 'Auto-reject Low Performers',
        description: 'Automatically reject candidates with AI score < 50',
        trigger: {
            type: 'application_created',
        },
        conditions: [
            {
                field: 'aiScore',
                operator: 'less_than',
                value: 50,
            },
        ],
        actions: [
            {
                type: 'update_status',
                config: {
                    status: 'rejected',
                },
            },
            {
                type: 'send_notification',
                config: {
                    recipient: 'candidate',
                    message: 'Thank you for applying to {{jobTitle}}. Unfortunately, we have decided to move forward with other candidates.',
                },
            },
            {
                type: 'add_note',
                config: {
                    note: 'Automatically rejected due to low AI score ({{aiScore}})',
                },
            },
        ],
        status: 'paused',
        lastExecutedAt: undefined,
    },
    {
        name: 'Notify on Top Candidates',
        description: 'Send notification when exceptional candidates (score > 90) apply',
        trigger: {
            type: 'application_created',
        },
        conditions: [
            {
                field: 'aiScore',
                operator: 'greater_than',
                value: 90,
            },
        ],
        actions: [
            {
                type: 'send_notification',
                config: {
                    recipient: 'recruiter',
                    message: '🌟 Exceptional candidate alert! {{candidateName}} scored {{aiScore}} for {{jobTitle}}',
                },
            },
            {
                type: 'add_note',
                config: {
                    note: '⭐ Top candidate - AI score: {{aiScore}}. Priority review recommended.',
                },
            },
        ],
        status: 'paused',
        lastExecutedAt: undefined,
    },
    {
        name: 'Move to Interview Stage',
        description: 'Automatically schedule interviews for reviewed candidates',
        trigger: {
            type: 'application_status_changed',
        },
        conditions: [
            {
                field: 'newStatus',
                operator: 'equals',
                value: 'reviewing',
            },
        ],
        actions: [
            {
                type: 'send_notification',
                config: {
                    recipient: 'recruiter',
                    message: 'Candidate {{candidateName}} is now under review for {{jobTitle}}. Consider scheduling an interview.',
                },
            },
            {
                type: 'add_note',
                config: {
                    note: 'Status changed to reviewing. Next step: Schedule interview.',
                },
            },
        ],
        status: 'paused',
        lastExecutedAt: undefined,
    },
    {
        name: 'Welcome New Applicants',
        description: 'Send welcome notification to all new applicants',
        trigger: {
            type: 'application_created',
        },
        conditions: [],
        actions: [
            {
                type: 'send_notification',
                config: {
                    recipient: 'candidate',
                    message: 'Thank you for applying to {{jobTitle}}! We have received your application and will review it shortly.',
                },
            },
            {
                type: 'add_note',
                config: {
                    note: 'Welcome notification sent to candidate.',
                },
            },
        ],
        status: 'paused',
        lastExecutedAt: undefined,
    },
];
