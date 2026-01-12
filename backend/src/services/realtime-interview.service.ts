import { GoogleGenerativeAI } from '@google/generative-ai';
import Interview from '../models/mongodb/Interview';
import { InterviewService } from './interview.service';
import { SpeechToTextService } from './speech-to-text.service';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface RealtimeSession {
    sessionId: string;
    interviewId: string;
    currentQuestionIndex: number;
    conversationHistory: Array<{
        role: 'interviewer' | 'candidate';
        content: string;
        timestamp: Date;
    }>;
    isActive: boolean;
    startedAt: Date;
}

export class RealtimeInterviewService {
    private static sessions: Map<string, RealtimeSession> = new Map();

    /**
     * Start a real-time interview session
     */
    static async startRealtimeSession(interviewId: string): Promise<RealtimeSession> {
        try {
            const interview = await Interview.findById(interviewId);
            if (!interview) {
                throw new Error('Interview not found');
            }

            const sessionId = uuidv4();
            const session: RealtimeSession = {
                sessionId,
                interviewId,
                currentQuestionIndex: 0,
                conversationHistory: [],
                isActive: true,
                startedAt: new Date(),
            };

            this.sessions.set(sessionId, session);

            // Initialize transcript
            SpeechToTextService.initializeTranscript(interviewId);

            // Add first question to conversation
            if (interview.questions.length > 0) {
                const firstQuestion = interview.questions[0];
                session.conversationHistory.push({
                    role: 'interviewer',
                    content: firstQuestion.question,
                    timestamp: new Date(),
                });

                // Add to transcript
                SpeechToTextService.addText(
                    interviewId,
                    firstQuestion.question,
                    'interviewer'
                );
            }

            logger.info(`Real-time session started: ${sessionId} for interview ${interviewId}`);
            return session;
        } catch (error) {
            logger.error('Failed to start real-time session:', error);
            throw error;
        }
    }

    /**
     * Get current question for the session
     */
    static getCurrentQuestion(sessionId: string): any {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        return this.getQuestionByIndex(session.interviewId, session.currentQuestionIndex);
    }

    /**
     * Get question by index
     */
    private static async getQuestionByIndex(
        interviewId: string,
        index: number
    ): Promise<any> {
        const interview = await Interview.findById(interviewId);
        if (!interview || index >= interview.questions.length) {
            return null;
        }
        return interview.questions[index];
    }

    /**
     * Submit answer in real-time session
     */
    static async submitRealtimeAnswer(
        sessionId: string,
        answer: string,
        isVoice: boolean = false
    ): Promise<any> {
        try {
            const session = this.sessions.get(sessionId);
            if (!session || !session.isActive) {
                throw new Error('Session not found or inactive');
            }

            const interview = await Interview.findById(session.interviewId);
            if (!interview) {
                throw new Error('Interview not found');
            }

            // Add answer to conversation history
            session.conversationHistory.push({
                role: 'candidate',
                content: answer,
                timestamp: new Date(),
            });

            // Add to transcript
            SpeechToTextService.addText(session.interviewId, answer, 'candidate');

            // Get current question
            const currentQuestion = interview.questions[session.currentQuestionIndex];

            // Evaluate answer in real-time
            const evaluation = await InterviewService.evaluateAnswer(
                currentQuestion.question,
                currentQuestion.expectedAnswer || '',
                answer
            );

            // Save answer to interview
            interview.answers.push({
                questionId: currentQuestion.id,
                answer,
                answeredAt: new Date(),
                timeSpent: 0,
                evaluation,
            });

            await interview.save();

            // Generate follow-up or next question
            const shouldAskFollowUp = await this.shouldAskFollowUp(
                currentQuestion.question,
                answer,
                evaluation.score
            );

            let nextQuestion = null;
            let followUpQuestion = null;

            if (shouldAskFollowUp) {
                // Generate contextual follow-up
                followUpQuestion = await this.generateFollowUpQuestion(
                    currentQuestion.question,
                    answer
                );

                if (followUpQuestion) {
                    session.conversationHistory.push({
                        role: 'interviewer',
                        content: followUpQuestion,
                        timestamp: new Date(),
                    });

                    SpeechToTextService.addText(
                        session.interviewId,
                        followUpQuestion,
                        'interviewer'
                    );
                }
            } else {
                // Move to next question
                session.currentQuestionIndex++;

                if (session.currentQuestionIndex < interview.questions.length) {
                    nextQuestion = interview.questions[session.currentQuestionIndex];

                    session.conversationHistory.push({
                        role: 'interviewer',
                        content: nextQuestion.question,
                        timestamp: new Date(),
                    });

                    SpeechToTextService.addText(
                        session.interviewId,
                        nextQuestion.question,
                        'interviewer'
                    );
                } else {
                    // Interview complete
                    session.isActive = false;
                    await InterviewService.completeInterview(session.interviewId);
                }
            }

            this.sessions.set(sessionId, session);

            return {
                evaluation,
                followUpQuestion,
                nextQuestion,
                isComplete: !session.isActive,
                currentQuestionIndex: session.currentQuestionIndex,
                totalQuestions: interview.questions.length,
            };
        } catch (error) {
            logger.error('Failed to submit real-time answer:', error);
            throw error;
        }
    }

    /**
     * Determine if a follow-up question should be asked
     */
    private static async shouldAskFollowUp(
        question: string,
        answer: string,
        score: number
    ): Promise<boolean> {
        // Ask follow-up if answer is incomplete (score < 7) or very good (score >= 8)
        // This creates a more dynamic interview experience
        if (score < 7) {
            return Math.random() < 0.6; // 60% chance for incomplete answers
        } else if (score >= 8) {
            return Math.random() < 0.3; // 30% chance for excellent answers
        }
        return false;
    }

    /**
     * Generate contextual follow-up question
     */
    private static async generateFollowUpQuestion(
        originalQuestion: string,
        answer: string
    ): Promise<string | null> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
You are an expert interviewer. Based on the candidate's answer, generate ONE concise follow-up question to dig deeper.

Original Question: ${originalQuestion}
Candidate's Answer: ${answer}

Generate a natural, conversational follow-up question that:
- Explores a specific point they mentioned
- Asks for clarification or examples
- Probes deeper into their experience
- Is brief (1-2 sentences max)

Follow-up Question:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            logger.error('Failed to generate follow-up question:', error);
            return null;
        }
    }

    /**
     * Generate next question with adaptive difficulty
     */
    static async generateAdaptiveQuestion(
        sessionId: string,
        previousScore: number
    ): Promise<string | null> {
        try {
            const session = this.sessions.get(sessionId);
            if (!session) return null;

            const interview = await Interview.findById(session.interviewId);
            if (!interview) return null;

            // Determine difficulty based on previous performance
            let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
            if (previousScore < 5) difficulty = 'easy';
            else if (previousScore >= 8) difficulty = 'hard';

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const conversationContext = session.conversationHistory
                .slice(-4)
                .map((msg) => `${msg.role}: ${msg.content}`)
                .join('\n');

            const prompt = `
You are conducting a ${interview.interviewType} interview. Generate the next question.

Previous conversation:
${conversationContext}

Generate a ${difficulty} difficulty question that:
- Builds on the conversation naturally
- Tests relevant skills
- Is clear and specific
- Takes 2-3 minutes to answer

Question:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            logger.error('Failed to generate adaptive question:', error);
            return null;
        }
    }

    /**
     * Get real-time feedback for candidate
     */
    static async getRealtimeFeedback(sessionId: string): Promise<any> {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const interview = await Interview.findById(session.interviewId);
        if (!interview) return null;

        const answeredQuestions = interview.answers.length;
        const totalQuestions = interview.questions.length;
        const averageScore =
            interview.answers.reduce((sum, ans) => sum + (ans.evaluation?.score || 0), 0) /
            Math.max(answeredQuestions, 1);

        return {
            progress: (answeredQuestions / totalQuestions) * 100,
            averageScore: averageScore.toFixed(1),
            questionsAnswered: answeredQuestions,
            totalQuestions,
            feedback: this.generateProgressFeedback(averageScore, answeredQuestions),
        };
    }

    /**
     * Generate encouraging feedback based on progress
     */
    private static generateProgressFeedback(averageScore: number, questionsAnswered: number): string {
        if (questionsAnswered === 0) {
            return 'Take your time and answer thoughtfully. You\'re doing great!';
        } else if (averageScore >= 8) {
            return 'Excellent responses! Keep up the great work!';
        } else if (averageScore >= 6) {
            return 'Good pace! Try to provide more specific examples.';
        } else {
            return 'Take a moment to think through your answers. You\'ve got this!';
        }
    }

    /**
     * End real-time session
     */
    static async endRealtimeSession(sessionId: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.isActive = false;
            this.sessions.set(sessionId, session);
            logger.info(`Real-time session ended: ${sessionId}`);
        }
    }

    /**
     * Get session details
     */
    static getSession(sessionId: string): RealtimeSession | undefined {
        return this.sessions.get(sessionId);
    }

    /**
     * Get conversation history
     */
    static getConversationHistory(sessionId: string): any[] {
        const session = this.sessions.get(sessionId);
        return session?.conversationHistory || [];
    }
}
