import { useState, useEffect } from 'react';
import { jobService } from '../services/localStorage.service';
import type { Job } from '../types';

export const useJobs = (recruiterId?: string) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadJobs = () => {
        setIsLoading(true);
        const allJobs = recruiterId
            ? jobService.getByRecruiter(recruiterId)
            : jobService.getAll();
        setJobs(allJobs);
        setIsLoading(false);
    };

    useEffect(() => {
        loadJobs();
    }, [recruiterId]);

    const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job => {
        const newJob = jobService.create(jobData);
        loadJobs();
        return newJob;
    };

    const updateJob = (id: string, updates: Partial<Job>): Job | null => {
        const updated = jobService.update(id, updates);
        if (updated) {
            loadJobs();
        }
        return updated;
    };

    const deleteJob = (id: string): boolean => {
        const success = jobService.delete(id);
        if (success) {
            loadJobs();
        }
        return success;
    };

    const getJobById = (id: string): Job | undefined => {
        return jobService.getById(id);
    };

    return {
        jobs,
        isLoading,
        createJob,
        updateJob,
        deleteJob,
        getJobById,
        refreshJobs: loadJobs
    };
};
