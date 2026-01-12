import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWebRTCOptions {
    onRemoteStream?: (stream: MediaStream) => void;
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
}

export const useWebRTC = (options: UseWebRTCOptions = {}) => {
    const { onRemoteStream, onConnectionStateChange } = options;

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
    const [error, setError] = useState<string | null>(null);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ],
    };

    // Initialize local media stream
    const initializeMedia = useCallback(async (audio: boolean = true, video: boolean = true) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio,
                video: video ? { width: 1280, height: 720 } : false,
            });

            localStreamRef.current = stream;
            setLocalStream(stream);
            setIsAudioEnabled(audio);
            setIsVideoEnabled(video);
            setError(null);

            return stream;
        } catch (err: any) {
            const errorMessage = err.name === 'NotAllowedError'
                ? 'Camera/microphone access denied'
                : 'Failed to access media devices';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, []);

    // Create peer connection
    const createPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(iceServers);

        // Add local stream tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current!);
            });
        }

        // Handle remote stream
        pc.ontrack = (event) => {
            const [stream] = event.streams;
            setRemoteStream(stream);
            onRemoteStream?.(stream);
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
            setConnectionState(pc.connectionState);
            onConnectionStateChange?.(pc.connectionState);
        };

        peerConnectionRef.current = pc;
        return pc;
    }, [onRemoteStream, onConnectionStateChange]);

    // Create offer
    const createOffer = useCallback(async (): Promise<RTCSessionDescriptionInit> => {
        if (!peerConnectionRef.current) {
            createPeerConnection();
        }

        const pc = peerConnectionRef.current!;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        return offer;
    }, [createPeerConnection]);

    // Create answer
    const createAnswer = useCallback(async (
        offer: RTCSessionDescriptionInit
    ): Promise<RTCSessionDescriptionInit> => {
        if (!peerConnectionRef.current) {
            createPeerConnection();
        }

        const pc = peerConnectionRef.current!;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        return answer;
    }, [createPeerConnection]);

    // Set remote answer
    const setRemoteAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
        if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
        }
    }, []);

    // Add ICE candidate
    const addICECandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        if (peerConnectionRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }, []);

    // Get ICE candidates
    const onICECandidate = useCallback((callback: (candidate: RTCIceCandidate) => void) => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    callback(event.candidate);
                }
            };
        }
    }, []);

    // Toggle audio
    const toggleAudio = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    }, []);

    // Toggle video
    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    }, []);

    // Stop all tracks
    const stopMedia = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
            setLocalStream(null);
        }
    }, []);

    // Close peer connection
    const closePeerConnection = useCallback(() => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setRemoteStream(null);
        setConnectionState('closed');
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopMedia();
            closePeerConnection();
        };
    }, [stopMedia, closePeerConnection]);

    return {
        localStream,
        remoteStream,
        isAudioEnabled,
        isVideoEnabled,
        connectionState,
        error,
        initializeMedia,
        createPeerConnection,
        createOffer,
        createAnswer,
        setRemoteAnswer,
        addICECandidate,
        onICECandidate,
        toggleAudio,
        toggleVideo,
        stopMedia,
        closePeerConnection,
    };
};
