import { GoogleGenerativeAI } from '@google/generative-ai';
import Interview from '../models/mongodb/Interview';
import { query } from '../config/postgres';
import Candidate from '../models/mongodb/Candidate';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class InterviewService {
    /**
     * Start a new interview session
     */
    static async startInterview(
        jobId: string,
        candidateId: string,
        organizationId: string,
        interviewType: 'screening' | 'technical' | 'behavioral' | 'final' = 'screening'
    ): Promise<any> {
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

            // Get candidate details
            const candidate = await Candidate.findById(candidateId);
            if (!candidate) {
                throw new Error('Candidate not found');
            }

            // Generate initial questions
            const questions = await this.generateQuestions(job, candidate, interviewType);

            // Create interview session
            const interview = await Interview.create({
                organizationId,
                jobId,
                candidateId,
                interviewType,
                status: 'in_progress',
                startedAt: new Date(),
                duration: 30,
                questions,
                answers: [],
                conversationHistory: [],
                totalScore: 0,
                maxScore: 100,
                percentageScore: 0,
                aiModel: 'gemini-pro',
                adaptiveDifficulty: true,
            });

            logger.info(`Interview started: ${interview._id}`);

            return {
                interviewId: interview._id,
                questions: questions.slice(0, 1), // Return first question only
                status: 'in_progress',
            };
        } catch (error) {
            logger.error('Failed to start interview:', error);
            throw error;
        }
    }

    /**
     * Generate interview questions
     */
    static async generateQuestions(
        job: any,
        candidate: any,
        interviewType: string
    ): Promise<any[]> {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
You are an expert technical interviewer. Generate ${interviewType} interview questions for this job and candidate.

Job Title: ${job.title}
Job Description: ${job.description}
Required Skills: ${JSON.stringify(job.required_skills)}

Candidate Background:
- Experience: ${candidate.totalExperienceYears} years
- Skills: ${candidate.skills.map((s: any) => s.name).join(', ')}
- Recent Role: ${candidate.experience[0]?.title || 'N/A'}

Generate 5 ${interviewType} questions as a JSON array:
[
  {
    "question": "Question text",
    "type": "${interviewType}",
    "difficulty": "easy|medium|hard",
    "expectedAnswer": "Brief expected answer or key points"
  }
]

Make questions:
- Relevant to the job requirements
- Appropriate for candidate's experience level
- Progressive in difficulty
- Specific and actionable

JSON Array:`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                // Fallback questions
                return this.getFallbackQuestions(interviewType);
            }

            const questions = JSON.parse(jsonMatch[0]);

            return questions.map((q: any) => ({
                id: uuidv4(),
                question: q.question,
                type: interviewType,
                difficulty: q.difficulty || 'medium',
                expectedAnswer: q.expectedAnswer,
                askedAt: new Date(),
            }));
        } catch (error) {
            logger.error('Question generation error:', error);
            return this.getFallbackQuestions(interviewType);
        }
    }

    /**
     * Submit answer to a question
     */
    static async submitAnswer(
        interviewId: string,
        questionId: string,
        answer: string,
        timeSpent: number
    ): Promise<any> {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            throw new Error('Interview not found');
        }

        // Add answer
        interview.answers.push({
            questionId,
            answer,
            answeredAt: new Date(),
            timeSpent,
        });

        // Add to conversation history
        interview.conversationHistory.push({
            role: 'candidate',
            content: answer,
            timestamp: new Date(),
        });

        await interview.save();

        // Check if all questions answered
        const allAnswered = interview.questions.length === interview.answers.length;

        if (allAnswered) {
            // Complete interview and evaluate
            return await this.completeInterview(interviewId);
        } else {
            // Return next question
            const nextQuestion = interview.questions[interview.answers.length];
            return {
                nextQuestion,
                questionsRemaining: interview.questions.length - interview.answers.length,
            };
        }
    }

    /**
     * Complete interview and evaluate
     */
    static async completeInterview(interviewId: string): Promise<any> {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            throw new Error('Interview not found');
        }

        // Evaluate all answers
        for (let i = 0; i < interview.answers.length; i++) {
            const answer = interview.answers[i];
            const question = interview.questions.find((q) => q.id === answer.questionId);

            if (question && !answer.evaluation) {
                const evaluation = await this.evaluateAnswer(
                    question.question,
                    question.expectedAnswer || '',
                    answer.answer
                );

                interview.answers[i].evaluation = evaluation;
            }
        }

        // Calculate total score
        const totalScore = interview.answers.reduce(
            (sum, ans) => sum + (ans.evaluation?.score || 0),
            0
        );
        const maxScore = interview.answers.length * 10;
        const percentageScore = (totalScore / maxScore) * 100;

        // Generate overall feedback
        const overallFeedback = await this.generateOverallFeedback(interview);

        // Determine recommendation
        let recommendation: 'strong_hire' | 'hire' | 'maybe' | 'no_hire' = 'no_hire';
        if (percentageScore >= 80) recommendation = 'strong_hire';
        else if (percentageScore >= 65) recommendation = 'hire';
        else if (percentageScore >= 50) recommendation = 'maybe';

        interview.status = 'completed';
        interview.completedAt = new Date();
        interview.totalScore = totalScore;
        interview.maxScore = maxScore;
        interview.percentageScore = percentageScore;
        interview.overallFeedback = overallFeedback;
        interview.recommendation = recommendation;

        await interview.save();

        logger.info(`Interview completed: ${interviewId}, Score: ${percentageScore}%`);

        return {
            interviewId,
            status: 'completed',
            totalScore,
            maxScore,
            percentageScore,
            recommendation,
            overallFeedback,
        };
    }

    /**
     * Evaluate a single answer
     */
    static async evaluateAnswer(
        question: string,
        expectedAnswer: string,
        candidateAnswer: string
    ): Promise<any> {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
Evaluate this interview answer on a scale of 0-10.

Question: ${question}
Expected Answer: ${expectedAnswer}
Candidate's Answer: ${candidateAnswer}

Provide evaluation as JSON:
{
  "score": 7,
  "feedback": "Brief feedback on the answer",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}

JSON:`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return {
                    score: 5,
                    maxScore: 10,
                    feedback: 'Unable to evaluate',
                    strengths: [],
                    improvements: [],
                    evaluatedAt: new Date(),
                    evaluatedBy: 'ai' as const,
                };
            }

            const evaluation = JSON.parse(jsonMatch[0]);

            return {
                score: evaluation.score || 5,
                maxScore: 10,
                feedback: evaluation.feedback || '',
                strengths: evaluation.strengths || [],
                improvements: evaluation.improvements || [],
                evaluatedAt: new Date(),
                evaluatedBy: 'ai' as const,
            };
        } catch (error) {
            logger.error('Answer evaluation error:', error);
            return {
                score: 5,
                maxScore: 10,
                feedback: 'Evaluation failed',
                strengths: [],
                improvements: [],
                evaluatedAt: new Date(),
                evaluatedBy: 'ai' as const,
            };
        }
    }

    /**
     * Generate overall feedback
     */
    static async generateOverallFeedback(interview: any): Promise<string> {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const answersText = interview.answers
            .map((a: any, i: number) => `Q${i + 1}: ${interview.questions[i]?.question}\nA: ${a.answer}\nScore: ${a.evaluation?.score || 0}/10`)
            .join('\n\n');

        const prompt = `
Based on this interview, provide concise overall feedback (2-3 sentences):

${answersText}

Feedback:`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            return 'Interview completed. Please review individual answers for detailed feedback.';
        }
    }

    /**
     * Fallback questions
     */
    static getFallbackQuestions(type: string): any[] {
        const questions: any = {
            screening: [
                { question: 'Tell me about yourself and your background.', difficulty: 'easy' },
                { question: 'Why are you interested in this position?', difficulty: 'easy' },
                { question: 'What are your key strengths?', difficulty: 'easy' },
            ],
            technical: [
                { question: 'Describe your experience with the main technologies listed in the job description.', difficulty: 'medium' },
                { question: 'Walk me through a challenging technical problem you solved recently.', difficulty: 'medium' },
            ],
            behavioral: [
                { question: 'Tell me about a time you worked in a team to achieve a goal.', difficulty: 'medium' },
                { question: 'Describe a situation where you had to meet a tight deadline.', difficulty: 'medium' },
            ],
        };

        return (questions[type] || questions.screening).map((q: any) => ({
            id: uuidv4(),
            question: q.question,
            type,
            difficulty: q.difficulty,
            askedAt: new Date(),
        }));
    }
}
