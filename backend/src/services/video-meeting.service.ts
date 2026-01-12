import axios from 'axios';
import { logger } from '../utils/logger';
import crypto from 'crypto';

interface ZoomMeeting {
    id: string;
    topic: string;
    start_time: string;
    duration: number;
    join_url: string;
    password?: string;
}

interface MeetingRoom {
    roomId: string;
    interviewId: string;
    hostId: string;
    participantId: string;
    zoomMeetingId?: string;
    zoomJoinUrl?: string;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    scheduledTime: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    recordingUrl?: string;
}

export class VideoMeetingService {
    private static ZOOM_API_BASE = 'https://api.zoom.us/v2';
    private static meetingRooms: Map<string, MeetingRoom> = new Map();

    /**
     * Generate Zoom JWT token for API authentication
     */
    private static generateZoomToken(): string {
        const apiKey = process.env.ZOOM_API_KEY || '';
        const apiSecret = process.env.ZOOM_API_SECRET || '';

        if (!apiKey || !apiSecret) {
            logger.warn('Zoom API credentials not configured');
            return '';
        }

        const payload = {
            iss: apiKey,
            exp: Date.now() + 5000,
        };

        const token = crypto
            .createHmac('sha256', apiSecret)
            .update(JSON.stringify(payload))
            .digest('base64');

        return token;
    }

    /**
     * Create a Zoom meeting for an interview
     */
    static async createZoomMeeting(
        interviewId: string,
        topic: string,
        startTime: Date,
        duration: number = 60,
        hostEmail: string
    ): Promise<ZoomMeeting | null> {
        try {
            const token = this.generateZoomToken();
            if (!token) {
                logger.warn('Skipping Zoom meeting creation - no credentials');
                return null;
            }

            const response = await axios.post(
                `${this.ZOOM_API_BASE}/users/${hostEmail}/meetings`,
                {
                    topic,
                    type: 2, // Scheduled meeting
                    start_time: startTime.toISOString(),
                    duration,
                    timezone: 'UTC',
                    settings: {
                        host_video: true,
                        participant_video: true,
                        join_before_host: false,
                        mute_upon_entry: true,
                        waiting_room: false,
                        audio: 'both',
                        auto_recording: 'cloud',
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            logger.info(`Zoom meeting created: ${response.data.id} for interview ${interviewId}`);

            return {
                id: response.data.id,
                topic: response.data.topic,
                start_time: response.data.start_time,
                duration: response.data.duration,
                join_url: response.data.join_url,
                password: response.data.password,
            };
        } catch (error) {
            logger.error('Failed to create Zoom meeting:', error);
            return null;
        }
    }

    /**
     * Create a virtual meeting room (WebRTC-based)
     */
    static async createMeetingRoom(
        interviewId: string,
        hostId: string,
        participantId: string,
        scheduledTime: Date,
        createZoomMeeting: boolean = false
    ): Promise<MeetingRoom> {
        const roomId = crypto.randomBytes(16).toString('hex');

        const meetingRoom: MeetingRoom = {
            roomId,
            interviewId,
            hostId,
            participantId,
            status: 'scheduled',
            scheduledTime,
        };

        // Optionally create Zoom meeting
        if (createZoomMeeting) {
            const zoomMeeting = await this.createZoomMeeting(
                interviewId,
                `Interview - ${interviewId}`,
                scheduledTime,
                60,
                'default@example.com' // Should be actual host email
            );

            if (zoomMeeting) {
                meetingRoom.zoomMeetingId = zoomMeeting.id;
                meetingRoom.zoomJoinUrl = zoomMeeting.join_url;
            }
        }

        this.meetingRooms.set(roomId, meetingRoom);
        logger.info(`Meeting room created: ${roomId} for interview ${interviewId}`);

        return meetingRoom;
    }

    /**
     * Get meeting room details
     */
    static getMeetingRoom(roomId: string): MeetingRoom | undefined {
        return this.meetingRooms.get(roomId);
    }

    /**
     * Start a meeting room
     */
    static async startMeetingRoom(roomId: string): Promise<MeetingRoom | null> {
        const room = this.meetingRooms.get(roomId);
        if (!room) {
            logger.error(`Meeting room not found: ${roomId}`);
            return null;
        }

        room.status = 'active';
        room.actualStartTime = new Date();
        this.meetingRooms.set(roomId, room);

        logger.info(`Meeting room started: ${roomId}`);
        return room;
    }

    /**
     * End a meeting room
     */
    static async endMeetingRoom(roomId: string): Promise<MeetingRoom | null> {
        const room = this.meetingRooms.get(roomId);
        if (!room) {
            logger.error(`Meeting room not found: ${roomId}`);
            return null;
        }

        room.status = 'completed';
        room.actualEndTime = new Date();
        this.meetingRooms.set(roomId, room);

        logger.info(`Meeting room ended: ${roomId}`);
        return room;
    }

    /**
     * Get Zoom meeting recording
     */
    static async getZoomRecording(meetingId: string): Promise<string | null> {
        try {
            const token = this.generateZoomToken();
            if (!token) return null;

            const response = await axios.get(
                `${this.ZOOM_API_BASE}/meetings/${meetingId}/recordings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const recordings = response.data.recording_files;
            if (recordings && recordings.length > 0) {
                return recordings[0].download_url;
            }

            return null;
        } catch (error) {
            logger.error('Failed to get Zoom recording:', error);
            return null;
        }
    }

    /**
     * Generate WebRTC signaling data for peer connection
     */
    static generateSignalingData(roomId: string): any {
        return {
            roomId,
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ],
        };
    }

    /**
     * Validate meeting room access
     */
    static validateAccess(roomId: string, userId: string): boolean {
        const room = this.meetingRooms.get(roomId);
        if (!room) return false;

        return room.hostId === userId || room.participantId === userId;
    }

    /**
     * Get all meeting rooms for an interview
     */
    static getMeetingRoomsByInterview(interviewId: string): MeetingRoom[] {
        const rooms: MeetingRoom[] = [];
        this.meetingRooms.forEach((room) => {
            if (room.interviewId === interviewId) {
                rooms.push(room);
            }
        });
        return rooms;
    }

    /**
     * Cancel a meeting room
     */
    static async cancelMeetingRoom(roomId: string): Promise<boolean> {
        const room = this.meetingRooms.get(roomId);
        if (!room) return false;

        room.status = 'cancelled';
        this.meetingRooms.set(roomId, room);

        // Cancel Zoom meeting if exists
        if (room.zoomMeetingId) {
            try {
                const token = this.generateZoomToken();
                if (token) {
                    await axios.delete(
                        `${this.ZOOM_API_BASE}/meetings/${room.zoomMeetingId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    logger.info(`Zoom meeting cancelled: ${room.zoomMeetingId}`);
                }
            } catch (error) {
                logger.error('Failed to cancel Zoom meeting:', error);
            }
        }

        return true;
    }
}
