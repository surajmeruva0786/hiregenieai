import Candidate from '../models/mongodb/Candidate';
import { query } from '../config/postgres';
import { EmbeddingService } from './embedding.service';
import { logger } from '../utils/logger';

export interface MatchScore {
    candidateId: string;
    totalScore: number;
    breakdown: {
        skillsScore: number;
        experienceScore: number;
        educationScore: number;
        vectorSimilarity: number;
    };
    explanation: string;
    matchPercentage: number;
}

export class MatchingService {
    /**
     * Match candidates to a job
     */
    static async matchCandidatesForJob(
        jobId: string,
        organizationId: string,
        limit: number = 50
    ): Promise<MatchScore[]> {
        try {
            // Get job details
            const jobResult = await query(
                'SELECT * FROM jobs WHERE id = $1 AND organization_id = $2',
                [jobId, organizationId]
            );

            if (jobResult.rows.length === 0) {
                throw new Error('Job not found');
            }

            const job = jobResult.rows[0];
            const requiredSkills = job.required_skills || [];
            const skillWeights = job.skill_weights || {};
            const experienceMin = job.experience_min || 0;
            const experienceMax = job.experience_max || 100;

            // Get all candidates for organization
            const candidates = await Candidate.find({ organizationId });

            // Score each candidate
            const scoredCandidates: MatchScore[] = [];

            for (const candidate of candidates) {
                const score = await this.calculateMatchScore(
                    candidate,
                    requiredSkills,
                    skillWeights,
                    experienceMin,
                    experienceMax,
                    job.description
                );

                scoredCandidates.push({
                    candidateId: candidate._id.toString(),
                    ...score,
                });
            }

            // Sort by total score and return top matches
            return scoredCandidates
                .sort((a, b) => b.totalScore - a.totalScore)
                .slice(0, limit);
        } catch (error) {
            logger.error('Matching error:', error);
            throw error;
        }
    }

    /**
     * Calculate match score for a candidate
     */
    static async calculateMatchScore(
        candidate: any,
        requiredSkills: any[],
        skillWeights: any,
        experienceMin: number,
        experienceMax: number,
        jobDescription: string
    ): Promise<Omit<MatchScore, 'candidateId'>> {
        // 1. Skills Score (40% weight)
        const skillsScore = this.calculateSkillsScore(
            candidate.skills,
            requiredSkills,
            skillWeights
        );

        // 2. Experience Score (30% weight)
        const experienceScore = this.calculateExperienceScore(
            candidate.totalExperienceYears,
            experienceMin,
            experienceMax
        );

        // 3. Education Score (10% weight)
        const educationScore = this.calculateEducationScore(candidate.education);

        // 4. Vector Similarity (20% weight)
        let vectorSimilarity = 0;
        if (candidate.resumeEmbedding && jobDescription) {
            try {
                const jobEmbedding = await EmbeddingService.generateEmbedding(jobDescription);
                vectorSimilarity = EmbeddingService.cosineSimilarity(
                    candidate.resumeEmbedding,
                    jobEmbedding
                );
            } catch (error) {
                logger.warn('Failed to calculate vector similarity:', error);
            }
        }

        // Calculate weighted total score
        const totalScore =
            skillsScore * 0.4 +
            experienceScore * 0.3 +
            educationScore * 0.1 +
            vectorSimilarity * 100 * 0.2;

        const matchPercentage = Math.round(totalScore);

        // Generate explanation
        const explanation = this.generateExplanation(
            skillsScore,
            experienceScore,
            educationScore,
            vectorSimilarity,
            candidate,
            requiredSkills
        );

        return {
            totalScore: Math.round(totalScore),
            breakdown: {
                skillsScore: Math.round(skillsScore),
                experienceScore: Math.round(experienceScore),
                educationScore: Math.round(educationScore),
                vectorSimilarity: Math.round(vectorSimilarity * 100),
            },
            explanation,
            matchPercentage,
        };
    }

    /**
     * Calculate skills match score
     */
    static calculateSkillsScore(
        candidateSkills: any[],
        requiredSkills: any[],
        skillWeights: any
    ): number {
        if (!requiredSkills || requiredSkills.length === 0) return 100;

        let totalWeight = 0;
        let matchedWeight = 0;

        for (const reqSkill of requiredSkills) {
            const skillName = typeof reqSkill === 'string' ? reqSkill : reqSkill.name;
            const weight = skillWeights[skillName] || 1;
            totalWeight += weight;

            // Check if candidate has this skill
            const hasSkill = candidateSkills.some(
                (cs) => cs.name.toLowerCase() === skillName.toLowerCase()
            );

            if (hasSkill) {
                const candidateSkill = candidateSkills.find(
                    (cs) => cs.name.toLowerCase() === skillName.toLowerCase()
                );
                const confidence = candidateSkill?.confidence || 1;
                matchedWeight += weight * confidence;
            }
        }

        return totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;
    }

    /**
     * Calculate experience score
     */
    static calculateExperienceScore(
        candidateExperience: number,
        minExperience: number,
        maxExperience: number
    ): number {
        if (candidateExperience < minExperience) {
            // Penalty for insufficient experience
            const deficit = minExperience - candidateExperience;
            return Math.max(0, 100 - deficit * 15);
        } else if (candidateExperience > maxExperience) {
            // Slight penalty for overqualification
            const excess = candidateExperience - maxExperience;
            return Math.max(70, 100 - excess * 5);
        } else {
            // Perfect match
            return 100;
        }
    }

    /**
     * Calculate education score
     */
    static calculateEducationScore(education: any[]): number {
        if (!education || education.length === 0) return 50;

        // Simple scoring based on highest degree
        const degrees = education.map((e) => e.degree?.toLowerCase() || '');

        if (degrees.some((d) => d.includes('phd') || d.includes('doctorate'))) {
            return 100;
        } else if (degrees.some((d) => d.includes('master'))) {
            return 90;
        } else if (degrees.some((d) => d.includes('bachelor'))) {
            return 80;
        } else {
            return 60;
        }
    }

    /**
     * Generate explanation for match score
     */
    static generateExplanation(
        skillsScore: number,
        experienceScore: number,
        educationScore: number,
        vectorSimilarity: number,
        candidate: any,
        requiredSkills: any[]
    ): string {
        const parts: string[] = [];

        // Skills explanation
        const matchedSkills = candidate.skills.filter((cs: any) =>
            requiredSkills.some(
                (rs: any) =>
                    (typeof rs === 'string' ? rs : rs.name).toLowerCase() === cs.name.toLowerCase()
            )
        );

        const missingSkills = requiredSkills.filter(
            (rs: any) =>
                !candidate.skills.some(
                    (cs: any) =>
                        cs.name.toLowerCase() === (typeof rs === 'string' ? rs : rs.name).toLowerCase()
                )
        );

        parts.push(
            `Skills Match: ${Math.round(skillsScore)}% - Matched ${matchedSkills.length} of ${requiredSkills.length} required skills`
        );

        if (matchedSkills.length > 0) {
            parts.push(
                `Matched Skills: ${matchedSkills.map((s: any) => s.name).join(', ')}`
            );
        }

        if (missingSkills.length > 0) {
            parts.push(
                `Missing Skills: ${missingSkills.map((s: any) => (typeof s === 'string' ? s : s.name)).join(', ')}`
            );
        }

        // Experience explanation
        parts.push(
            `Experience: ${Math.round(experienceScore)}% - ${candidate.totalExperienceYears} years of experience`
        );

        // Education explanation
        const highestDegree = candidate.education?.[0]?.degree || 'Not specified';
        parts.push(`Education: ${Math.round(educationScore)}% - ${highestDegree}`);

        // Semantic similarity
        parts.push(
            `Semantic Match: ${Math.round(vectorSimilarity * 100)}% - Resume relevance to job description`
        );

        return parts.join(' | ');
    }

    /**
     * Get match explanation for specific candidate-job pair
     */
    static async getMatchExplanation(
        candidateId: string,
        jobId: string,
        organizationId: string
    ): Promise<MatchScore> {
        const jobResult = await query(
            'SELECT * FROM jobs WHERE id = $1 AND organization_id = $2',
            [jobId, organizationId]
        );

        if (jobResult.rows.length === 0) {
            throw new Error('Job not found');
        }

        const job = jobResult.rows[0];
        const candidate = await Candidate.findById(candidateId);

        if (!candidate) {
            throw new Error('Candidate not found');
        }

        const score = await this.calculateMatchScore(
            candidate,
            job.required_skills || [],
            job.skill_weights || {},
            job.experience_min || 0,
            job.experience_max || 100,
            job.description
        );

        return {
            candidateId,
            ...score,
        };
    }
}
