import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

interface UseWebSocketOptions {
    autoConnect?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
    const { autoConnect = false } = options;
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const listenersRef = useRef<Map<string, Function>>(new Map());

    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect]);

    const connect = useCallback(() => {
        if (socketRef.current?.connected) {
            return;
        }

        const token = localStorage.getItem('token');
        socketRef.current = io(SOCKET_URL, {
            auth: {
                token,
            },
            transports: ['websocket'],
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            setError(null);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
        });

        socketRef.current.on('error', (err: any) => {
            setError(err.message || 'WebSocket error');
        });

        socketRef.current.on('connect_error', (err) => {
            setError(err.message || 'Connection error');
        });
    }, []);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    const emit = useCallback((event: string, data?: any) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit(event, data);
        } else {
            console.warn('Socket not connected');
        }
    }, []);

    const on = useCallback((event: string, callback: Function) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback as any);
            listenersRef.current.set(event, callback);
        }
    }, []);

    const off = useCallback((event: string) => {
        if (socketRef.current) {
            socketRef.current.off(event);
            listenersRef.current.delete(event);
        }
    }, []);

    const joinInterview = useCallback((interviewId: string, userId: string) => {
        emit('join-interview', { interviewId, userId });
    }, [emit]);

    const startRealtimeSession = useCallback((interviewId: string) => {
        emit('start-session', { interviewId });
    }, [emit]);

    const submitAnswer = useCallback((sessionId: string, answer: string, isVoice: boolean = false) => {
        emit('submit-answer', { sessionId, answer, isVoice });
    }, [emit]);

    const sendAudioChunk = useCallback((interviewId: string, audioData: ArrayBuffer) => {
        emit('audio-chunk', { interviewId, audioData });
    }, [emit]);

    const joinRoom = useCallback((roomId: string, userId: string) => {
        emit('join-room', { roomId, userId });
    }, [emit]);

    const sendWebRTCOffer = useCallback((to: string, offer: RTCSessionDescriptionInit) => {
        emit('webrtc-offer', { to, offer });
    }, [emit]);

    const sendWebRTCAnswer = useCallback((to: string, answer: RTCSessionDescriptionInit) => {
        emit('webrtc-answer', { to, answer });
    }, [emit]);

    const sendICECandidate = useCallback((to: string, candidate: RTCIceCandidate) => {
        emit('ice-candidate', { to, candidate });
    }, [emit]);

    const requestFeedback = useCallback((sessionId: string) => {
        emit('request-feedback', { sessionId });
    }, [emit]);

    return {
        isConnected,
        error,
        connect,
        disconnect,
        emit,
        on,
        off,
        // Convenience methods
        joinInterview,
        startRealtimeSession,
        submitAnswer,
        sendAudioChunk,
        joinRoom,
        sendWebRTCOffer,
        sendWebRTCAnswer,
        sendICECandidate,
        requestFeedback,
    };
};
