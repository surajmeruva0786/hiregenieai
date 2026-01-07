import { useState, useEffect } from 'react';
import { workflowService } from '../services/workflow.localStorage.service';
import { workflowEngine } from '../services/workflowEngine.service';
import type { Workflow } from '../types';

export const useWorkflows = () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadWorkflows = () => {
        setIsLoading(true);
        const allWorkflows = workflowService.getAll();
        setWorkflows(allWorkflows);
        setIsLoading(false);
    };

    useEffect(() => {
        loadWorkflows();
    }, []);

    const createWorkflow = (workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>): Workflow => {
        const newWorkflow = workflowService.create(workflowData);
        loadWorkflows();
        return newWorkflow;
    };

    const updateWorkflow = (id: string, updates: Partial<Workflow>): Workflow | null => {
        const updated = workflowService.update(id, updates);
        if (updated) {
            loadWorkflows();
        }
        return updated;
    };

    const deleteWorkflow = (id: string): boolean => {
        const success = workflowService.delete(id);
        if (success) {
            loadWorkflows();
        }
        return success;
    };

    const toggleWorkflowStatus = (id: string): Workflow | null => {
        const updated = workflowService.toggleStatus(id);
        if (updated) {
            loadWorkflows();
        }
        return updated;
    };

    const executeWorkflow = async (id: string, triggerData: any): Promise<boolean> => {
        const success = await workflowEngine.executeWorkflow(id, triggerData);
        loadWorkflows(); // Refresh to update execution counts
        return success;
    };

    const getWorkflowById = (id: string): Workflow | undefined => {
        return workflowService.getById(id);
    };

    const getExecutionStats = (id: string) => {
        return workflowService.getExecutionStats(id);
    };

    return {
        workflows,
        isLoading,
        createWorkflow,
        updateWorkflow,
        deleteWorkflow,
        toggleWorkflowStatus,
        executeWorkflow,
        getWorkflowById,
        getExecutionStats,
        refreshWorkflows: loadWorkflows,
    };
};
