import { query } from '../config/postgres';
import { notificationQueue, workflowQueue } from '../queues';
import Candidate from '../models/mongodb/Candidate';
import { logger } from '../utils/logger';

export interface WorkflowTrigger {
    type: 'score_threshold' | 'stage_change' | 'interview_complete' | 'time_based' | 'manual';
    config: any;
}

export interface WorkflowCondition {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
    value: any;
}

export interface WorkflowAction {
    type: 'send_email' | 'move_stage' | 'schedule_interview' | 'create_task' | 'webhook';
    config: any;
}

export class WorkflowService {
    /**
     * Create workflow
     */
    static async createWorkflow(
        organizationId: string,
        name: string,
        description: string,
        trigger: WorkflowTrigger,
        conditions: WorkflowCondition[],
        actions: WorkflowAction[],
        createdBy: string
    ): Promise<any> {
        const result = await query(
            `INSERT INTO workflows (organization_id, name, description, trigger_type, trigger_config, conditions, actions, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [
                organizationId,
                name,
                description,
                trigger.type,
                JSON.stringify(trigger.config),
                JSON.stringify(conditions),
                JSON.stringify(actions),
                createdBy,
            ]
        );

        logger.info(`Workflow created: ${name}`);
        return result.rows[0];
    }

    /**
     * Evaluate workflow trigger
     */
    static async evaluateTrigger(
        workflowId: string,
        triggerData: any
    ): Promise<boolean> {
        const workflowResult = await query(
            'SELECT * FROM workflows WHERE id = $1 AND is_active = true',
            [workflowId]
        );

        if (workflowResult.rows.length === 0) {
            return false;
        }

        const workflow = workflowResult.rows[0];

        // Evaluate conditions
        const conditionsMet = await this.evaluateConditions(
            workflow.conditions,
            triggerData
        );

        if (conditionsMet) {
            // Execute actions
            await this.executeActions(workflow.actions, triggerData, workflow.organization_id);
            return true;
        }

        return false;
    }

    /**
     * Evaluate conditions
     */
    static async evaluateConditions(
        conditions: WorkflowCondition[],
        data: any
    ): Promise<boolean> {
        if (!conditions || conditions.length === 0) {
            return true; // No conditions means always execute
        }

        for (const condition of conditions) {
            const fieldValue = this.getNestedValue(data, condition.field);
            const conditionMet = this.evaluateCondition(
                fieldValue,
                condition.operator,
                condition.value
            );

            if (!conditionMet) {
                return false; // All conditions must be met
            }
        }

        return true;
    }

    /**
     * Evaluate single condition
     */
    static evaluateCondition(
        fieldValue: any,
        operator: string,
        expectedValue: any
    ): boolean {
        switch (operator) {
            case 'equals':
                return fieldValue === expectedValue;
            case 'not_equals':
                return fieldValue !== expectedValue;
            case 'greater_than':
                return Number(fieldValue) > Number(expectedValue);
            case 'less_than':
                return Number(fieldValue) < Number(expectedValue);
            case 'contains':
                return String(fieldValue).includes(String(expectedValue));
            default:
                return false;
        }
    }

    /**
     * Execute workflow actions
     */
    static async executeActions(
        actions: WorkflowAction[],
        data: any,
        organizationId: string
    ): Promise<void> {
        for (const action of actions) {
            try {
                await this.executeAction(action, data, organizationId);
            } catch (error) {
                logger.error(`Failed to execute action: ${action.type}`, error);
            }
        }
    }

    /**
     * Execute single action
     */
    static async executeAction(
        action: WorkflowAction,
        data: any,
        organizationId: string
    ): Promise<void> {
        switch (action.type) {
            case 'send_email':
                await this.sendEmailAction(action.config, data, organizationId);
                break;

            case 'move_stage':
                await this.moveStageAction(action.config, data, organizationId);
                break;

            case 'schedule_interview':
                await this.scheduleInterviewAction(action.config, data, organizationId);
                break;

            case 'create_task':
                await this.createTaskAction(action.config, data, organizationId);
                break;

            case 'webhook':
                await this.webhookAction(action.config, data);
                break;

            default:
                logger.warn(`Unknown action type: ${action.type}`);
        }
    }

    /**
     * Send email action
     */
    static async sendEmailAction(
        config: any,
        data: any,
        organizationId: string
    ): Promise<void> {
        const recipientEmail = this.getNestedValue(data, config.recipientField) || config.recipientEmail;

        await notificationQueue.add('send-notification', {
            type: config.notificationType || 'workflow',
            recipientEmail,
            subject: this.replaceVariables(config.subject, data),
            templateName: config.templateName,
            templateData: {
                ...config.templateData,
                ...data,
            },
            organizationId,
        });

        logger.info(`Email action queued for ${recipientEmail}`);
    }

    /**
     * Move stage action
     */
    static async moveStageAction(
        config: any,
        data: any,
        organizationId: string
    ): Promise<void> {
        const candidateId = data.candidateId;
        const jobId = data.jobId;
        const stage = config.stage;

        await query(
            `INSERT INTO pipeline_stages (job_id, candidate_id, stage, notes)
       VALUES ($1, $2, $3, $4)`,
            [jobId, candidateId, stage, 'Automated by workflow']
        );

        logger.info(`Candidate ${candidateId} moved to ${stage} by workflow`);
    }

    /**
     * Schedule interview action
     */
    static async scheduleInterviewAction(
        config: any,
        data: any,
        organizationId: string
    ): Promise<void> {
        // This would integrate with interview scheduling system
        logger.info(`Interview scheduled for candidate ${data.candidateId}`);
    }

    /**
     * Create task action
     */
    static async createTaskAction(
        config: any,
        data: any,
        organizationId: string
    ): Promise<void> {
        // This would create a task in a task management system
        logger.info(`Task created: ${config.taskTitle}`);
    }

    /**
     * Webhook action
     */
    static async webhookAction(config: any, data: any): Promise<void> {
        const axios = require('axios');

        try {
            await axios.post(config.url, {
                ...data,
                timestamp: new Date().toISOString(),
            }, {
                headers: config.headers || {},
            });

            logger.info(`Webhook called: ${config.url}`);
        } catch (error) {
            logger.error(`Webhook failed: ${config.url}`, error);
        }
    }

    /**
     * Get nested value from object
     */
    static getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    /**
     * Replace variables in string
     */
    static replaceVariables(template: string, data: any): string {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return this.getNestedValue(data, key) || match;
        });
    }

    /**
     * Trigger workflow based on event
     */
    static async triggerWorkflow(
        organizationId: string,
        triggerType: string,
        triggerData: any
    ): Promise<void> {
        // Get all active workflows with this trigger type
        const result = await query(
            `SELECT * FROM workflows 
       WHERE organization_id = $1 
       AND trigger_type = $2 
       AND is_active = true`,
            [organizationId, triggerType]
        );

        for (const workflow of result.rows) {
            // Queue workflow execution
            await workflowQueue.add('execute-workflow', {
                workflowId: workflow.id,
                triggerData,
                organizationId,
            });
        }

        logger.info(`Triggered ${result.rows.length} workflows for ${triggerType}`);
    }
}
