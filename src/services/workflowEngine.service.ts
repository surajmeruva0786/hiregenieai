import { workflowService } from './workflow.localStorage.service';
import { applicationService } from './localStorage.service';
import type { Workflow, WorkflowCondition, WorkflowAction, Application } from '../types';

// ============= WORKFLOW ENGINE =============

export const workflowEngine = {
    /**
     * Evaluate if conditions are met
     */
    evaluateConditions(conditions: WorkflowCondition[], data: any): boolean {
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
                console.log(`❌ Condition not met: ${condition.field} ${condition.operator} ${condition.value}`);
                return false; // All conditions must be met
            }
        }

        console.log('✅ All conditions met');
        return true;
    },

    /**
     * Evaluate single condition
     */
    evaluateCondition(fieldValue: any, operator: string, expectedValue: any): boolean {
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
                return String(fieldValue).toLowerCase().includes(String(expectedValue).toLowerCase());
            default:
                return false;
        }
    },

    /**
     * Execute workflow actions
     */
    async executeActions(actions: WorkflowAction[], data: any): Promise<void> {
        for (const action of actions) {
            try {
                await this.executeAction(action, data);
            } catch (error) {
                console.error(`❌ Failed to execute action: ${action.type}`, error);
                throw error;
            }
        }
    },

    /**
     * Execute single action
     */
    async executeAction(action: WorkflowAction, data: any): Promise<void> {
        console.log(`🎯 Executing action: ${action.type}`);

        switch (action.type) {
            case 'update_status':
                await this.updateStatusAction(action.config, data);
                break;

            case 'send_notification':
                await this.sendNotificationAction(action.config, data);
                break;

            case 'add_note':
                await this.addNoteAction(action.config, data);
                break;

            default:
                console.warn(`⚠️ Unknown action type: ${action.type}`);
        }
    },

    /**
     * Update application status action
     */
    async updateStatusAction(config: any, data: any): Promise<void> {
        const applicationId = data.applicationId || data.id;
        const newStatus = config.status;

        if (!applicationId || !newStatus) {
            throw new Error('Missing applicationId or status in update_status action');
        }

        const updated = applicationService.updateStatus(applicationId, newStatus);
        if (updated) {
            console.log(`✅ Updated application ${applicationId} status to: ${newStatus}`);
        } else {
            throw new Error(`Failed to update application ${applicationId}`);
        }
    },

    /**
     * Send notification action (simulated)
     */
    async sendNotificationAction(config: any, data: any): Promise<void> {
        const message = this.replaceVariables(config.message || 'Workflow notification', data);
        const recipient = config.recipient || 'recruiter';

        console.log(`📧 Notification sent to ${recipient}: ${message}`);

        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('HireGenie Workflow', {
                body: message,
                icon: '/favicon.ico',
            });
        }
    },

    /**
     * Add note action
     */
    async addNoteAction(config: any, data: any): Promise<void> {
        const applicationId = data.applicationId || data.id;
        const note = this.replaceVariables(config.note || 'Automated note', data);

        if (!applicationId) {
            throw new Error('Missing applicationId in add_note action');
        }

        // Get current application
        const app = applicationService.getById(applicationId);
        if (!app) {
            throw new Error(`Application ${applicationId} not found`);
        }

        // Append note
        const existingNotes = app.notes || '';
        const timestamp = new Date().toLocaleString();
        const newNotes = existingNotes
            ? `${existingNotes}\n\n[${timestamp}] ${note}`
            : `[${timestamp}] ${note}`;

        // Update application with new notes
        const data_storage = JSON.parse(localStorage.getItem('hiregenie_data') || '{}');
        const appIndex = data_storage.applications.findIndex((a: any) => a.id === applicationId);
        if (appIndex !== -1) {
            data_storage.applications[appIndex].notes = newNotes;
            localStorage.setItem('hiregenie_data', JSON.stringify(data_storage));
            console.log(`📝 Added note to application ${applicationId}`);
        }
    },

    /**
     * Get nested value from object
     */
    getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    },

    /**
     * Replace variables in string (e.g., {{candidateName}})
     */
    replaceVariables(template: string, data: any): string {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return this.getNestedValue(data, key) || match;
        });
    },

    /**
     * Trigger workflows based on event
     */
    async triggerWorkflows(triggerType: string, triggerData: any): Promise<void> {
        console.log(`🚀 Triggering workflows for: ${triggerType}`);

        // Get all active workflows with this trigger type
        const workflows = workflowService.getByTriggerType(triggerType);

        console.log(`Found ${workflows.length} active workflow(s) for ${triggerType}`);

        for (const workflow of workflows) {
            try {
                console.log(`\n🔄 Evaluating workflow: ${workflow.name}`);

                // Evaluate conditions
                const conditionsMet = this.evaluateConditions(workflow.conditions, triggerData);

                if (conditionsMet) {
                    console.log(`✅ Executing workflow: ${workflow.name}`);

                    // Execute actions
                    await this.executeActions(workflow.actions, triggerData);

                    // Record successful execution
                    workflowService.recordExecution(workflow.id, true, triggerData);

                    console.log(`✅ Workflow completed: ${workflow.name}\n`);
                } else {
                    console.log(`⏭️ Skipping workflow (conditions not met): ${workflow.name}\n`);
                }
            } catch (error: any) {
                console.error(`❌ Workflow failed: ${workflow.name}`, error);

                // Record failed execution
                workflowService.recordExecution(
                    workflow.id,
                    false,
                    triggerData,
                    error.message || 'Unknown error'
                );
            }
        }
    },

    /**
     * Manually trigger a specific workflow
     */
    async executeWorkflow(workflowId: string, triggerData: any): Promise<boolean> {
        const workflow = workflowService.getById(workflowId);

        if (!workflow) {
            console.error(`Workflow not found: ${workflowId}`);
            return false;
        }

        if (workflow.status !== 'active') {
            console.warn(`Workflow is not active: ${workflow.name}`);
            return false;
        }

        try {
            console.log(`🎯 Manually executing workflow: ${workflow.name}`);

            // Evaluate conditions
            const conditionsMet = this.evaluateConditions(workflow.conditions, triggerData);

            if (!conditionsMet) {
                console.log(`❌ Conditions not met for: ${workflow.name}`);
                return false;
            }

            // Execute actions
            await this.executeActions(workflow.actions, triggerData);

            // Record successful execution
            workflowService.recordExecution(workflow.id, true, triggerData);

            console.log(`✅ Workflow completed: ${workflow.name}`);
            return true;
        } catch (error: any) {
            console.error(`❌ Workflow failed: ${workflow.name}`, error);

            // Record failed execution
            workflowService.recordExecution(
                workflow.id,
                false,
                triggerData,
                error.message || 'Unknown error'
            );

            return false;
        }
    },
};
