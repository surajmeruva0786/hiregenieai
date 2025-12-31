import { query } from '../config/postgres';
import Candidate from '../models/mongodb/Candidate';
import Interview from '../models/mongodb/Interview';
import { logger } from '../utils/logger';

export class AnalyticsService {
    /**
     * Get recruitment funnel analytics for a job
     */
    static async getJobFunnel(jobId: string, organizationId: string): Promise<any> {
        // Get pipeline stages count
        const stagesResult = await query(
            `SELECT stage, COUNT(DISTINCT candidate_id) as count
       FROM pipeline_stages
       WHERE job_id = $1
       GROUP BY stage
       ORDER BY 
         CASE stage
           WHEN 'applied' THEN 1
           WHEN 'screening' THEN 2
           WHEN 'shortlisted' THEN 3
           WHEN 'interview_scheduled' THEN 4
           WHEN 'interview_completed' THEN 5
           WHEN 'evaluation' THEN 6
           WHEN 'offer' THEN 7
           WHEN 'hired' THEN 8
           WHEN 'rejected' THEN 9
         END`,
            [jobId]
        );

        const funnel = stagesResult.rows.reduce((acc: any, row) => {
            acc[row.stage] = parseInt(row.count);
            return acc;
        }, {});

        // Calculate conversion rates
        const applied = funnel.applied || 0;
        const conversions = {
            screening_rate: applied > 0 ? ((funnel.screening || 0) / applied) * 100 : 0,
            shortlist_rate: applied > 0 ? ((funnel.shortlisted || 0) / applied) * 100 : 0,
            interview_rate: applied > 0 ? ((funnel.interview_completed || 0) / applied) * 100 : 0,
            offer_rate: applied > 0 ? ((funnel.offer || 0) / applied) * 100 : 0,
            hire_rate: applied > 0 ? ((funnel.hired || 0) / applied) * 100 : 0,
        };

        return {
            funnel,
            conversions,
            totalApplicants: applied,
        };
    }

    /**
     * Get time-to-hire metrics
     */
    static async getTimeToHire(jobId: string, organizationId: string): Promise<any> {
        const result = await query(
            `SELECT 
         AVG(EXTRACT(EPOCH FROM (hired.moved_at - applied.moved_at)) / 86400) as avg_days,
         MIN(EXTRACT(EPOCH FROM (hired.moved_at - applied.moved_at)) / 86400) as min_days,
         MAX(EXTRACT(EPOCH FROM (hired.moved_at - applied.moved_at)) / 86400) as max_days
       FROM pipeline_stages applied
       JOIN pipeline_stages hired ON applied.candidate_id = hired.candidate_id 
         AND applied.job_id = hired.job_id
       WHERE applied.job_id = $1 
         AND applied.stage = 'applied'
         AND hired.stage = 'hired'`,
            [jobId]
        );

        return {
            averageDays: Math.round(parseFloat(result.rows[0]?.avg_days || '0')),
            minDays: Math.round(parseFloat(result.rows[0]?.min_days || '0')),
            maxDays: Math.round(parseFloat(result.rows[0]?.max_days || '0')),
        };
    }

    /**
     * Get candidate quality metrics
     */
    static async getCandidateQualityMetrics(
        jobId: string,
        organizationId: string
    ): Promise<any> {
        // Get interview scores for this job
        const interviews = await Interview.find({ jobId, organizationId });

        if (interviews.length === 0) {
            return {
                averageScore: 0,
                totalInterviews: 0,
                scoreDistribution: {},
            };
        }

        const scores = interviews.map((i) => i.percentageScore);
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Score distribution
        const distribution = {
            excellent: scores.filter((s) => s >= 80).length,
            good: scores.filter((s) => s >= 65 && s < 80).length,
            average: scores.filter((s) => s >= 50 && s < 65).length,
            poor: scores.filter((s) => s < 50).length,
        };

        return {
            averageScore: Math.round(averageScore),
            totalInterviews: interviews.length,
            scoreDistribution: distribution,
        };
    }

    /**
     * Get source effectiveness
     */
    static async getSourceEffectiveness(organizationId: string): Promise<any> {
        const candidates = await Candidate.find({ organizationId });

        const sourceStats = candidates.reduce((acc: any, candidate) => {
            const source = candidate.source || 'unknown';
            if (!acc[source]) {
                acc[source] = {
                    total: 0,
                    hired: 0,
                    averageExperience: 0,
                    totalExperience: 0,
                };
            }

            acc[source].total++;
            acc[source].totalExperience += candidate.totalExperienceYears;

            // Check if hired
            const isHired = candidate.appliedJobs.some((job) => job.status === 'hired');
            if (isHired) {
                acc[source].hired++;
            }

            return acc;
        }, {});

        // Calculate averages and rates
        Object.keys(sourceStats).forEach((source) => {
            const stats = sourceStats[source];
            stats.averageExperience = Math.round(stats.totalExperience / stats.total);
            stats.hireRate = ((stats.hired / stats.total) * 100).toFixed(2);
            delete stats.totalExperience;
        });

        return sourceStats;
    }

    /**
     * Get skill demand analytics
     */
    static async getSkillDemand(organizationId: string): Promise<any> {
        const jobsResult = await query(
            `SELECT required_skills FROM jobs WHERE organization_id = $1 AND status = 'published'`,
            [organizationId]
        );

        const skillCounts: any = {};

        jobsResult.rows.forEach((row) => {
            const skills = row.required_skills || [];
            skills.forEach((skill: any) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
            });
        });

        // Sort by demand
        const sortedSkills = Object.entries(skillCounts)
            .map(([skill, count]) => ({ skill, count }))
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 20); // Top 20 skills

        return sortedSkills;
    }

    /**
     * Get organization overview
     */
    static async getOrganizationOverview(organizationId: string): Promise<any> {
        // Total jobs
        const jobsResult = await query(
            'SELECT COUNT(*) as count, status FROM jobs WHERE organization_id = $1 GROUP BY status',
            [organizationId]
        );

        const jobs = jobsResult.rows.reduce((acc: any, row) => {
            acc[row.status] = parseInt(row.count);
            return acc;
        }, {});

        // Total candidates
        const totalCandidates = await Candidate.countDocuments({ organizationId });

        // Total interviews
        const totalInterviews = await Interview.countDocuments({ organizationId });

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentCandidates = await Candidate.countDocuments({
            organizationId,
            createdAt: { $gte: thirtyDaysAgo },
        });

        const recentInterviews = await Interview.countDocuments({
            organizationId,
            createdAt: { $gte: thirtyDaysAgo },
        });

        return {
            jobs: {
                total: Object.values(jobs).reduce((a: any, b: any) => a + b, 0),
                published: jobs.published || 0,
                draft: jobs.draft || 0,
                closed: jobs.closed || 0,
            },
            candidates: {
                total: totalCandidates,
                recent: recentCandidates,
            },
            interviews: {
                total: totalInterviews,
                recent: recentInterviews,
            },
        };
    }

    /**
     * Get AI decision logs
     */
    static async getAIDecisionLogs(
        organizationId: string,
        limit: number = 100
    ): Promise<any> {
        const interviews = await Interview.find({ organizationId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('candidateId jobId percentageScore recommendation createdAt');

        return interviews.map((interview) => ({
            interviewId: interview._id,
            candidateId: interview.candidateId,
            jobId: interview.jobId,
            score: interview.percentageScore,
            recommendation: interview.recommendation,
            timestamp: interview.createdAt,
        }));
    }

    /**
     * Get diversity metrics
     */
    static async getDiversityMetrics(organizationId: string): Promise<any> {
        // This would analyze candidate demographics if available
        // For now, return placeholder
        return {
            message: 'Diversity metrics require demographic data collection',
            note: 'Ensure compliance with local regulations when collecting demographic data',
        };
    }
}
