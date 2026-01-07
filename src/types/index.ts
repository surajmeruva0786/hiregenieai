// Type Definitions for HireGenie Application

export interface User {
    id: string;
    email: string;
    password: string; // In real app, this would be hashed
    firstName: string;
    lastName: string;
    userType: 'recruiter' | 'student';
    organizationName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    experience: string;
    salary?: string;
    description: string;
    requirements: string[];
    skills: string[];
    status: 'active' | 'closed' | 'draft';
    recruiterId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    resumeUrl?: string;
    skills: string[];
    experience: number; // years
    education: string;
    summary?: string;
    linkedIn?: string;
    github?: string;
    portfolio?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Application {
    id: string;
    jobId: string;
    candidateId: string;
    status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
    appliedAt: string;
    notes?: string;
}

export interface Interview {
    id: string;
    applicationId: string;
    jobId: string;
    candidateId: string;
    scheduledAt: string;
    duration: number; // minutes
    type: 'phone' | 'video' | 'in-person' | 'ai';
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    score?: number;
    feedback?: string;
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    token?: string;
    message?: string;
}

export interface WorkflowTrigger {
    type: 'application_created' | 'application_status_changed' | 'ai_score_calculated' | 'manual';
    config?: any;
}

export interface WorkflowCondition {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
    value: any;
}

export interface WorkflowAction {
    type: 'update_status' | 'send_notification' | 'add_note';
    config: any;
}

export interface WorkflowExecution {
    id: string;
    workflowId: string;
    executedAt: string;
    success: boolean;
    triggerData: any;
    error?: string;
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    trigger: WorkflowTrigger;
    conditions: WorkflowCondition[];
    actions: WorkflowAction[];
    status: 'active' | 'paused';
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    executionCount: number;
    lastExecutedAt?: string;
}

export interface StorageData {
    users: User[];
    jobs: Job[];
    candidates: Candidate[];
    applications: Application[];
    interviews: Interview[];
    workflows: Workflow[];
    workflowExecutions: WorkflowExecution[];
    currentUser: User | null;
}
