import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { RealtimeInterviewService } from '../services/realtime-interview.service';
import { SpeechToTextService } from '../services/speech-to-text.service';
import { VideoMeetingService } from '../services/video-meeting.service';

interface SocketData {
    userId?: string;
    interviewId?: string;
    sessionId?: string;
    roomId?: string;
}

export class WebSocketServer {
    private io: Server;
    private activeSessions: Map<string, Set<string>> = new Map(); // interviewId -> Set of socketIds

    constructor(httpServer: HTTPServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:5173',
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });

        this.setupEventHandlers();
        logger.info('WebSocket server initialized');
    }

    private setupEventHandlers() {
        this.io.on('connection', (socket: Socket) => {
            logger.info(`Client connected: ${socket.id}`);

            // Join interview room
            socket.on('join-interview', async (data: { interviewId: string; userId: string }) => {
                try {
                    const { interviewId, userId } = data;
                    socket.data.interviewId = interviewId;
                    socket.data.userId = userId;

                    socket.join(`interview-${interviewId}`);

                    // Track active session
                    if (!this.activeSessions.has(interviewId)) {
                        this.activeSessions.set(interviewId, new Set());
                    }
                    this.activeSessions.get(interviewId)?.add(socket.id);

                    logger.info(`User ${userId} joined interview ${interviewId}`);

                    socket.emit('joined-interview', {
                        success: true,
                        interviewId,
                    });
                } catch (error) {
                    logger.error('Error joining interview:', error);
                    socket.emit('error', { message: 'Failed to join interview' });
                }
            });

            // Start real-time session
            socket.on('start-realtime-session', async (data: { interviewId: string }) => {
                try {
                    const session = await RealtimeInterviewService.startRealtimeSession(
                        data.interviewId
                    );
                    socket.data.sessionId = session.sessionId;

                    socket.emit('session-started', {
                        sessionId: session.sessionId,
                        firstQuestion: session.conversationHistory[0],
                    });

                    logger.info(`Real-time session started: ${session.sessionId}`);
                } catch (error) {
                    logger.error('Error starting real-time session:', error);
                    socket.emit('error', { message: 'Failed to start session' });
                }
            });

            // Submit answer
            socket.on(
                'submit-answer',
                async (data: { sessionId: string; answer: string; isVoice: boolean }) => {
                    try {
                        const result = await RealtimeInterviewService.submitRealtimeAnswer(
                            data.sessionId,
                            data.answer,
                            data.isVoice
                        );

                        socket.emit('answer-evaluated', result);

                        // Broadcast to other participants (e.g., interviewer)
                        if (socket.data.interviewId) {
                            socket
                                .to(`interview-${socket.data.interviewId}`)
                                .emit('candidate-answered', {
                                    answer: data.answer,
                                    evaluation: result.evaluation,
                                });
                        }

                        logger.info(`Answer submitted for session: ${data.sessionId}`);
                    } catch (error) {
                        logger.error('Error submitting answer:', error);
                        socket.emit('error', { message: 'Failed to submit answer' });
                    }
                }
            );

            // Audio stream for speech-to-text
            socket.on('audio-chunk', async (data: { interviewId: string; audioData: Buffer }) => {
                try {
                    const segment = await SpeechToTextService.transcribeAudioChunk(
                        data.interviewId,
                        data.audioData,
                        'candidate'
                    );

                    if (segment) {
                        socket.emit('transcription', {
                            text: segment.text,
                            confidence: segment.confidence,
                        });
                    }
                } catch (error) {
                    logger.error('Error processing audio chunk:', error);
                }
            });

            // WebRTC signaling
            socket.on('join-room', async (data: { roomId: string; userId: string }) => {
                try {
                    const { roomId, userId } = data;

                    // Validate access
                    const hasAccess = VideoMeetingService.validateAccess(roomId, userId);
                    if (!hasAccess) {
                        socket.emit('error', { message: 'Access denied' });
                        return;
                    }

                    socket.data.roomId = roomId;
                    socket.join(`room-${roomId}`);

                    // Get signaling data
                    const signalingData = VideoMeetingService.generateSignalingData(roomId);

                    socket.emit('room-joined', signalingData);

                    // Notify other participants
                    socket.to(`room-${roomId}`).emit('user-joined', {
                        userId,
                        socketId: socket.id,
                    });

                    logger.info(`User ${userId} joined room ${roomId}`);
                } catch (error) {
                    logger.error('Error joining room:', error);
                    socket.emit('error', { message: 'Failed to join room' });
                }
            });

            // WebRTC offer
            socket.on('webrtc-offer', (data: { to: string; offer: any }) => {
                socket.to(data.to).emit('webrtc-offer', {
                    from: socket.id,
                    offer: data.offer,
                });
            });

            // WebRTC answer
            socket.on('webrtc-answer', (data: { to: string; answer: any }) => {
                socket.to(data.to).emit('webrtc-answer', {
                    from: socket.id,
                    answer: data.answer,
                });
            });

            // ICE candidate
            socket.on('ice-candidate', (data: { to: string; candidate: any }) => {
                socket.to(data.to).emit('ice-candidate', {
                    from: socket.id,
                    candidate: data.candidate,
                });
            });

            // Request feedback
            socket.on('request-feedback', async (data: { sessionId: string }) => {
                try {
                    const feedback = await RealtimeInterviewService.getRealtimeFeedback(
                        data.sessionId
                    );
                    socket.emit('feedback-update', feedback);
                } catch (error) {
                    logger.error('Error getting feedback:', error);
                }
            });

            // Disconnect
            socket.on('disconnect', () => {
                logger.info(`Client disconnected: ${socket.id}`);

                // Clean up active sessions
                if (socket.data.interviewId) {
                    const sessions = this.activeSessions.get(socket.data.interviewId);
                    if (sessions) {
                        sessions.delete(socket.id);
                        if (sessions.size === 0) {
                            this.activeSessions.delete(socket.data.interviewId);
                        }
                    }
                }

                // Notify room participants
                if (socket.data.roomId) {
                    socket.to(`room-${socket.data.roomId}`).emit('user-left', {
                        socketId: socket.id,
                    });
                }
            });
        });
    }

    /**
     * Send message to specific interview room
     */
    public sendToInterview(interviewId: string, event: string, data: any) {
        this.io.to(`interview-${interviewId}`).emit(event, data);
    }

    /**
     * Send message to specific video room
     */
    public sendToRoom(roomId: string, event: string, data: any) {
        this.io.to(`room-${roomId}`).emit(event, data);
    }

    /**
     * Get active sessions count
     */
    public getActiveSessionsCount(): number {
        return this.activeSessions.size;
    }

    /**
     * Get Socket.IO server instance
     */
    public getIO(): Server {
        return this.io;
    }
}
