import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface TranscriptSegment {
    text: string;
    timestamp: Date;
    confidence: number;
    speaker?: 'interviewer' | 'candidate';
}

interface InterviewTranscript {
    interviewId: string;
    segments: TranscriptSegment[];
    fullText: string;
    createdAt: Date;
    updatedAt: Date;
}

export class SpeechToTextService {
    private static transcripts: Map<string, InterviewTranscript> = new Map();

    /**
     * Initialize transcript for an interview
     */
    static initializeTranscript(interviewId: string): InterviewTranscript {
        const transcript: InterviewTranscript = {
            interviewId,
            segments: [],
            fullText: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.transcripts.set(interviewId, transcript);
        logger.info(`Transcript initialized for interview: ${interviewId}`);
        return transcript;
    }

    /**
     * Process audio chunk and convert to text
     * Note: This is a simplified implementation. In production, you would use
     * Google Cloud Speech-to-Text API or similar service for real-time transcription.
     */
    static async transcribeAudioChunk(
        interviewId: string,
        audioData: Buffer,
        speaker: 'interviewer' | 'candidate' = 'candidate'
    ): Promise<TranscriptSegment | null> {
        try {
            // In a real implementation, you would send audioData to Google Speech-to-Text API
            // For now, we'll simulate transcription
            logger.info(`Processing audio chunk for interview: ${interviewId}`);

            // Placeholder: In production, replace with actual API call
            // const transcription = await this.callSpeechToTextAPI(audioData);

            // For demonstration, we'll return a mock segment
            const segment: TranscriptSegment = {
                text: '[Audio transcription would appear here]',
                timestamp: new Date(),
                confidence: 0.95,
                speaker,
            };

            // Add to transcript
            this.addSegment(interviewId, segment);

            return segment;
        } catch (error) {
            logger.error('Audio transcription error:', error);
            return null;
        }
    }

    /**
     * Add a text segment to transcript (for text-based answers)
     */
    static addSegment(
        interviewId: string,
        segment: TranscriptSegment
    ): InterviewTranscript | null {
        const transcript = this.transcripts.get(interviewId);
        if (!transcript) {
            logger.error(`Transcript not found for interview: ${interviewId}`);
            return null;
        }

        transcript.segments.push(segment);
        transcript.fullText += `\n[${segment.speaker || 'unknown'}] ${segment.text}`;
        transcript.updatedAt = new Date();

        this.transcripts.set(interviewId, transcript);
        return transcript;
    }

    /**
     * Add text directly to transcript (for typed answers)
     */
    static addText(
        interviewId: string,
        text: string,
        speaker: 'interviewer' | 'candidate' = 'candidate'
    ): TranscriptSegment {
        const segment: TranscriptSegment = {
            text,
            timestamp: new Date(),
            confidence: 1.0,
            speaker,
        };

        this.addSegment(interviewId, segment);
        return segment;
    }

    /**
     * Get transcript for an interview
     */
    static getTranscript(interviewId: string): InterviewTranscript | undefined {
        return this.transcripts.get(interviewId);
    }

    /**
     * Get full text transcript
     */
    static getFullText(interviewId: string): string {
        const transcript = this.transcripts.get(interviewId);
        return transcript?.fullText || '';
    }

    /**
     * Export transcript to file
     */
    static async exportTranscript(
        interviewId: string,
        format: 'txt' | 'json' = 'txt'
    ): Promise<string | null> {
        try {
            const transcript = this.transcripts.get(interviewId);
            if (!transcript) {
                logger.error(`Transcript not found for interview: ${interviewId}`);
                return null;
            }

            const uploadsDir = path.join(process.cwd(), 'uploads', 'transcripts');
            await fs.mkdir(uploadsDir, { recursive: true });

            const filename = `transcript_${interviewId}_${Date.now()}.${format}`;
            const filepath = path.join(uploadsDir, filename);

            if (format === 'json') {
                await fs.writeFile(filepath, JSON.stringify(transcript, null, 2));
            } else {
                let content = `Interview Transcript - ${interviewId}\n`;
                content += `Created: ${transcript.createdAt.toISOString()}\n`;
                content += `Updated: ${transcript.updatedAt.toISOString()}\n`;
                content += `\n${'='.repeat(60)}\n\n`;

                transcript.segments.forEach((segment) => {
                    const time = segment.timestamp.toLocaleTimeString();
                    const speaker = segment.speaker?.toUpperCase() || 'UNKNOWN';
                    content += `[${time}] ${speaker}:\n${segment.text}\n\n`;
                });

                await fs.writeFile(filepath, content);
            }

            logger.info(`Transcript exported: ${filepath}`);
            return filepath;
        } catch (error) {
            logger.error('Failed to export transcript:', error);
            return null;
        }
    }

    /**
     * Generate summary of transcript using AI
     */
    static async generateSummary(interviewId: string): Promise<string> {
        try {
            const transcript = this.transcripts.get(interviewId);
            if (!transcript) {
                return 'Transcript not found';
            }

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
Summarize this interview transcript in 3-4 sentences. Focus on:
- Key topics discussed
- Candidate's main points
- Overall interview flow

Transcript:
${transcript.fullText}

Summary:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            logger.error('Failed to generate transcript summary:', error);
            return 'Failed to generate summary';
        }
    }

    /**
     * Extract key points from transcript
     */
    static async extractKeyPoints(interviewId: string): Promise<string[]> {
        try {
            const transcript = this.transcripts.get(interviewId);
            if (!transcript) {
                return [];
            }

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
Extract 5-7 key points from this interview transcript as a JSON array of strings.

Transcript:
${transcript.fullText}

JSON Array:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) return [];

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            logger.error('Failed to extract key points:', error);
            return [];
        }
    }

    /**
     * Clear transcript (for cleanup)
     */
    static clearTranscript(interviewId: string): boolean {
        return this.transcripts.delete(interviewId);
    }

    /**
     * Get transcript statistics
     */
    static getStatistics(interviewId: string): any {
        const transcript = this.transcripts.get(interviewId);
        if (!transcript) return null;

        const candidateSegments = transcript.segments.filter(
            (s) => s.speaker === 'candidate'
        );
        const interviewerSegments = transcript.segments.filter(
            (s) => s.speaker === 'interviewer'
        );

        return {
            totalSegments: transcript.segments.length,
            candidateSegments: candidateSegments.length,
            interviewerSegments: interviewerSegments.length,
            totalWords: transcript.fullText.split(/\s+/).length,
            averageConfidence:
                transcript.segments.reduce((sum, s) => sum + s.confidence, 0) /
                transcript.segments.length,
            duration:
                transcript.segments.length > 0
                    ? new Date(
                        transcript.segments[transcript.segments.length - 1].timestamp.getTime() -
                        transcript.segments[0].timestamp.getTime()
                    )
                    : 0,
        };
    }
}
