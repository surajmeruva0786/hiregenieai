import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from './utils/logger';
import { RealtimeInterviewService } from './services/realtime-interview.service';

export function setupWebSocket(httpServer: HTTPServer): SocketIOServer {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true,
        },
    });

    logger.info('WebSocket server initialized');

    io.on('connection', (socket: Socket) => {
        logger.info(`Client connected: ${socket.id}`);

        // Join interview room
        socket.on('join-interview', async (data: { interviewId: string; userId: string }) => {
            try {
                const { interviewId, userId } = data;
                socket.join(`interview-${interviewId}`);
                logger.info(`User ${userId} joined interview ${interviewId}`);

                socket.emit('joined-interview', {
                    interviewId,
                    message: 'Successfully joined interview',
                });
            } catch (error: any) {
                logger.error('Join interview error:', error);
                socket.emit('error', { message: error.message });
            }
        });

        // Start real-time interview session
        socket.on('start-session', async (data: { interviewId: string }) => {
            try {
                const { interviewId } = data;
                const session = await RealtimeInterviewService.startRealtimeSession(interviewId);

                // Get first question
                const firstQuestion = session.conversationHistory[0];

                socket.emit('session-started', {
                    sessionId: session.sessionId,
                    firstQuestion: firstQuestion?.content,
                    message: 'Interview session started',
                });

                logger.info(`Real-time session started: ${session.sessionId}`);
            } catch (error: any) {
                logger.error('Start session error:', error);
                socket.emit('error', { message: error.message });
            }
        });

        // Submit answer
        socket.on('submit-answer', async (data: { sessionId: string; answer: string; isVoice?: boolean }) => {
            try {
                const { sessionId, answer, isVoice = false } = data;

                const result = await RealtimeInterviewService.submitRealtimeAnswer(
                    sessionId,
                    answer,
                    isVoice
                );

                socket.emit('answer-evaluated', {
                    evaluation: result.evaluation,
                    followUpQuestion: result.followUpQuestion,
                    nextQuestion: result.nextQuestion?.question,
                    isComplete: result.isComplete,
                    currentQuestionIndex: result.currentQuestionIndex,
                    totalQuestions: result.totalQuestions,
                });

                // Send feedback update
                const feedback = await RealtimeInterviewService.getRealtimeFeedback(sessionId);
                if (feedback) {
                    socket.emit('feedback-update', feedback);
                }

                logger.info(`Answer submitted for session: ${sessionId}`);
            } catch (error: any) {
                logger.error('Submit answer error:', error);
                socket.emit('error', { message: error.message });
            }
        });

        // Request feedback
        socket.on('request-feedback', async (data: { sessionId: string }) => {
            try {
                const { sessionId } = data;
                const feedback = await RealtimeInterviewService.getRealtimeFeedback(sessionId);

                if (feedback) {
                    socket.emit('feedback-update', feedback);
                }
            } catch (error: any) {
                logger.error('Request feedback error:', error);
                socket.emit('error', { message: error.message });
            }
        });

        // End session
        socket.on('end-session', async (data: { sessionId: string }) => {
            try {
                const { sessionId } = data;
                await RealtimeInterviewService.endRealtimeSession(sessionId);

                socket.emit('session-ended', {
                    message: 'Interview session ended',
                });

                logger.info(`Session ended: ${sessionId}`);
            } catch (error: any) {
                logger.error('End session error:', error);
                socket.emit('error', { message: error.message });
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
}
