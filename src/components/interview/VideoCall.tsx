import { useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { useWebRTC } from '../../hooks/useWebRTC';

interface VideoCallProps {
    roomId?: string;
    onEndCall?: () => void;
    showControls?: boolean;
}

export default function VideoCall({ roomId, onEndCall, showControls = true }: VideoCallProps) {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    const {
        localStream,
        remoteStream,
        isAudioEnabled,
        isVideoEnabled,
        connectionState,
        error,
        initializeMedia,
        toggleAudio,
        toggleVideo,
        stopMedia,
    } = useWebRTC({
        onRemoteStream: (stream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
        },
    });

    // Initialize media on mount
    useEffect(() => {
        initializeMedia(true, true);

        return () => {
            stopMedia();
        };
    }, [initializeMedia, stopMedia]);

    // Set local video stream
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    const handleEndCall = () => {
        stopMedia();
        onEndCall?.();
    };

    return (
        <div className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden">
            {/* Remote Video (Main) */}
            <div className="absolute inset-0">
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Waiting for interviewer to join...</p>
                            {connectionState !== 'connected' && (
                                <p className="text-gray-500 text-sm mt-2">
                                    Connection: {connectionState}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg">
                {localStream ? (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover mirror"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-600" />
                    </div>
                )}
                {!isVideoEnabled && (
                    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                        <CameraOff className="w-8 h-8 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    {error}
                </div>
            )}

            {/* Controls */}
            {showControls && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                        onClick={toggleAudio}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isAudioEnabled
                                ? 'bg-white/20 hover:bg-white/30'
                                : 'bg-red-500 hover:bg-red-600'
                            }`}
                        title={isAudioEnabled ? 'Mute' : 'Unmute'}
                    >
                        {isAudioEnabled ? (
                            <Mic className="w-6 h-6 text-white" />
                        ) : (
                            <MicOff className="w-6 h-6 text-white" />
                        )}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoEnabled
                                ? 'bg-white/20 hover:bg-white/30'
                                : 'bg-red-500 hover:bg-red-600'
                            }`}
                        title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                    >
                        {isVideoEnabled ? (
                            <Camera className="w-6 h-6 text-white" />
                        ) : (
                            <CameraOff className="w-6 h-6 text-white" />
                        )}
                    </button>

                    {onEndCall && (
                        <button
                            onClick={handleEndCall}
                            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all"
                            title="End call"
                        >
                            <PhoneOff className="w-6 h-6 text-white" />
                        </button>
                    )}
                </div>
            )}

            <style>{`
                .mirror {
                    transform: scaleX(-1);
                }
            `}</style>
        </div>
    );
}
