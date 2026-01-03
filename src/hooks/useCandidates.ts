import { useState, useEffect } from 'react';
import { candidateService } from '../services/localStorage.service';
import type { Candidate } from '../types';

export const useCandidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCandidates = () => {
        setIsLoading(true);
        const allCandidates = candidateService.getAll();
        setCandidates(allCandidates);
        setIsLoading(false);
    };

    useEffect(() => {
        loadCandidates();
    }, []);

    const createCandidate = (candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Candidate => {
        const newCandidate = candidateService.create(candidateData);
        loadCandidates();
        return newCandidate;
    };

    const updateCandidate = (id: string, updates: Partial<Candidate>): Candidate | null => {
        const updated = candidateService.update(id, updates);
        if (updated) {
            loadCandidates();
        }
        return updated;
    };

    const deleteCandidate = (id: string): boolean => {
        const success = candidateService.delete(id);
        if (success) {
            loadCandidates();
        }
        return success;
    };

    const getCandidateById = (id: string): Candidate | undefined => {
        return candidateService.getById(id);
    };

    return {
        candidates,
        isLoading,
        createCandidate,
        updateCandidate,
        deleteCandidate,
        getCandidateById,
        refreshCandidates: loadCandidates
    };
};
