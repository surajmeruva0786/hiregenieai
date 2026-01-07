import type { Workflow, WorkflowExecution, WorkflowTrigger, WorkflowCondition, WorkflowAction } from '../types';

const STORAGE_KEY = 'hiregenie_data';

// Get data from localStorage
const getData = (): any => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        return { workflows: [], workflowExecutions: [] };
    }
    return JSON.parse(data);
};

// Save data to localStorage
const saveData = (data: any): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Generate unique ID
const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ============= WORKFLOW SERVICES =============

export const workflowService = {
    getAll: (): Workflow[] => {
        const data = getData();
        return data.workflows || [];
    },

    getById: (id: string): Workflow | undefined => {
        const data = getData();
        return data.workflows?.find((w: Workflow) => w.id === id);
    },

    getActive: (): Workflow[] => {
        const data = getData();
        return (data.workflows || []).filter((w: Workflow) => w.status === 'active');
    },

    getByTriggerType: (triggerType: string): Workflow[] => {
        const data = getData();
        return (data.workflows || []).filter(
            (w: Workflow) => w.status === 'active' && w.trigger.type === triggerType
        );
    },

    create: (workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'lastExecutedAt'>): Workflow => {
        const data = getData();
        const newWorkflow: Workflow = {
            ...workflowData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            executionCount: 0,
        };

        if (!data.workflows) {
            data.workflows = [];
        }
        data.workflows.push(newWorkflow);
        saveData(data);

        console.log('✅ Workflow created:', newWorkflow.name);
        return newWorkflow;
    },

    update: (id: string, updates: Partial<Workflow>): Workflow | null => {
        const data = getData();
        if (!data.workflows) {
            return null;
        }

        const index = data.workflows.findIndex((w: Workflow) => w.id === id);
        if (index === -1) return null;

        data.workflows[index] = {
            ...data.workflows[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        saveData(data);
        console.log('✅ Workflow updated:', data.workflows[index].name);
        return data.workflows[index];
    },

    delete: (id: string): boolean => {
        const data = getData();
        if (!data.workflows) {
            return false;
        }

        const index = data.workflows.findIndex((w: Workflow) => w.id === id);
        if (index === -1) return false;

        const workflowName = data.workflows[index].name;
        data.workflows.splice(index, 1);
        saveData(data);

        console.log('🗑️ Workflow deleted:', workflowName);
        return true;
    },

    toggleStatus: (id: string): Workflow | null => {
        const data = getData();
        if (!data.workflows) {
            return null;
        }

        const index = data.workflows.findIndex((w: Workflow) => w.id === id);
        if (index === -1) return null;

        const newStatus = data.workflows[index].status === 'active' ? 'paused' : 'active';
        data.workflows[index].status = newStatus;
        data.workflows[index].updatedAt = new Date().toISOString();

        saveData(data);
        console.log(`🔄 Workflow ${newStatus}:`, data.workflows[index].name);
        return data.workflows[index];
    },

    recordExecution: (workflowId: string, success: boolean, triggerData: any, error?: string): void => {
        const data = getData();

        // Record execution
        const execution: WorkflowExecution = {
            id: generateId(),
            workflowId,
            executedAt: new Date().toISOString(),
            success,
            triggerData,
            error,
        };

        if (!data.workflowExecutions) {
            data.workflowExecutions = [];
        }
        data.workflowExecutions.push(execution);

        // Update workflow execution count and last executed time
        if (data.workflows) {
            const workflowIndex = data.workflows.findIndex((w: Workflow) => w.id === workflowId);
            if (workflowIndex !== -1) {
                data.workflows[workflowIndex].executionCount++;
                data.workflows[workflowIndex].lastExecutedAt = new Date().toISOString();
            }
        }

        saveData(data);
        console.log(`📊 Workflow execution recorded: ${success ? '✅ Success' : '❌ Failed'}`);
    },

    getExecutions: (workflowId?: string): WorkflowExecution[] => {
        const data = getData();
        const executions = data.workflowExecutions || [];

        if (workflowId) {
            return executions.filter((e: WorkflowExecution) => e.workflowId === workflowId);
        }

        return executions;
    },

    getExecutionStats: (workflowId: string): { total: number; successful: number; failed: number } => {
        const executions = workflowService.getExecutions(workflowId);
        return {
            total: executions.length,
            successful: executions.filter(e => e.success).length,
            failed: executions.filter(e => !e.success).length,
        };
    },
};
