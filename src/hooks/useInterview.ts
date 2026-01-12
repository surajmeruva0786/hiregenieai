import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Interview {
    _id: string;
    jobId: string;
    candidateId: string;
    interviewType: string;
    status: string;
    questions: any[];
    answers: any[];
}

interface RealtimeSession {
    sessionId: string;
    interviewId: string;
    currentQuestionIndex: number;
    conversationHistory: any[];
    isActive: boolean;
}

export const useInterview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startInterview = useCallback(async (
        jobId: string,
        candidateId: string,
        interviewType: string = 'screening'
    ): Promise<any> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`${API_BASE_URL}/interviews/start`, {
                jobId,
                candidateId,
                interviewType,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to start interview';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const submitAnswer = useCallback(async (
        interviewId: string,
        questionId: string,
        answer: string,
        timeSpent: number
    ): Promise<any> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${API_BASE_URL}/interviews/${interviewId}/answer`,
                {
                    questionId,
                    answer,
                    timeSpent,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to submit answer';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const getInterview = useCallback(async (interviewId: string): Promise<Interview> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${API_BASE_URL}/interviews/${interviewId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to get interview';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const scheduleMeeting = useCallback(async (
        interviewId: string,
        scheduledTime: Date,
        createZoomMeeting: boolean = false
    ): Promise<any> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${API_BASE_URL}/interviews/${interviewId}/schedule-meeting`,
                {
                    scheduledTime: scheduledTime.toISOString(),
                    createZoomMeeting,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to schedule meeting';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const startRealtimeSession = useCallback(async (
        interviewId: string
    ): Promise<RealtimeSession> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${API_BASE_URL}/interviews/${interviewId}/start-realtime`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to start realtime session';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const submitVoiceAnswer = useCallback(async (
        interviewId: string,
        sessionId: string,
        answer: string,
        isVoice: boolean = false
    ): Promise<any> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${API_BASE_URL}/interviews/${interviewId}/submit-voice-answer`,
                {
                    sessionId,
                    answer,
                    isVoice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to submit voice answer';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTranscript = useCallback(async (interviewId: string): Promise<any> => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${API_BASE_URL}/interviews/${interviewId}/transcript`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            return response.data.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to get transcript';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        startInterview,
        submitAnswer,
        getInterview,
        scheduleMeeting,
        startRealtimeSession,
        submitVoiceAnswer,
        getTranscript,
    };
};
