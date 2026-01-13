// API Service for HireGenie AI Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

class ApiService {
    private getHeaders(): HeadersInit {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = this.getHeaders();

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    message: response.statusText,
                }));
                throw new Error(error.message || 'API request failed');
            }

            const data: ApiResponse<T> = await response.json();
            return data.data;
        } catch (error: any) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // Resume Parsing
    async parseResume(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('resume', file);

        const url = `${API_BASE_URL}/resumes/parse`;
        const token = localStorage.getItem('token');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to parse resume');
        }

        const data: ApiResponse<any> = await response.json();
        return data.data;
    }

    async extractSkills(text: string): Promise<any> {
        return this.request('/resumes/extract-skills', {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
    }

    // Candidate Matching
    async matchCandidatesForJob(jobId: string, limit: number = 50): Promise<any> {
        return this.request(`/matching/jobs/${jobId}/match?limit=${limit}`, {
            method: 'POST',
        });
    }

    async getMatchExplanation(candidateId: string, jobId: string): Promise<any> {
        return this.request(`/matching/candidates/${candidateId}/jobs/${jobId}/explanation`);
    }

    // Interview
    async startInterview(
        jobId: string,
        candidateId: string,
        interviewType: string = 'screening'
    ): Promise<any> {
        return this.request('/interviews/start', {
            method: 'POST',
            body: JSON.stringify({ jobId, candidateId, interviewType }),
        });
    }

    async submitAnswer(
        interviewId: string,
        questionId: string,
        answer: string,
        timeSpent: number
    ): Promise<any> {
        return this.request(`/interviews/${interviewId}/answer`, {
            method: 'POST',
            body: JSON.stringify({ questionId, answer, timeSpent }),
        });
    }

    async getInterview(interviewId: string): Promise<any> {
        return this.request(`/interviews/${interviewId}`);
    }

    // Analytics
    async getJobFunnel(jobId: string): Promise<any> {
        return this.request(`/analytics/jobs/${jobId}/funnel`);
    }

    async getTimeToHire(jobId: string): Promise<any> {
        return this.request(`/analytics/jobs/${jobId}/time-to-hire`);
    }

    async getCandidateQuality(jobId: string): Promise<any> {
        return this.request(`/analytics/jobs/${jobId}/candidate-quality`);
    }

    async getSourceEffectiveness(): Promise<any> {
        return this.request('/analytics/source-effectiveness');
    }

    async getSkillDemand(): Promise<any> {
        return this.request('/analytics/skill-demand');
    }

    async getOrganizationOverview(): Promise<any> {
        return this.request('/analytics/overview');
    }

    async getAIDecisionLogs(limit: number = 100): Promise<any> {
        return this.request(`/analytics/ai-decisions?limit=${limit}`);
    }
}

export const apiService = new ApiService();
export default apiService;
