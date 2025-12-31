import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
    id: string;
    question: string;
    type: 'technical' | 'behavioral' | 'situational' | 'coding';
    difficulty: 'easy' | 'medium' | 'hard';
    expectedAnswer?: string;
    rubric?: string;
    askedAt: Date;
}

export interface IAnswer {
    questionId: string;
    answer: string;
    answeredAt: Date;
    timeSpent: number; // in seconds
    evaluation?: {
        score: number;
        maxScore: number;
        feedback: string;
        strengths: string[];
        improvements: string[];
        evaluatedAt: Date;
        evaluatedBy: 'ai' | 'human';
        evaluatorId?: string;
    };
}

export interface IInterview extends Document {
    organizationId: string;
    jobId: string;
    candidateId: string;
    interviewType: 'screening' | 'technical' | 'behavioral' | 'final';
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

    // Session details
    scheduledAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    duration: number; // in minutes

    // Questions and answers
    questions: IQuestion[];
    answers: IAnswer[];
    conversationHistory: Array<{
        role: 'ai' | 'candidate';
        content: string;
        timestamp: Date;
    }>;

    // Scoring
    totalScore: number;
    maxScore: number;
    percentageScore: number;
    breakdown: {
        technical?: number;
        behavioral?: number;
        communication?: number;
        problemSolving?: number;
    };

    // AI metadata
    aiModel: string;
    adaptiveDifficulty: boolean;

    // Final evaluation
    overallFeedback?: string;
    recommendation?: 'strong_hire' | 'hire' | 'maybe' | 'no_hire';
    evaluatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema({
    id: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, enum: ['technical', 'behavioral', 'situational', 'coding'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    expectedAnswer: String,
    rubric: String,
    askedAt: { type: Date, default: Date.now }
});

const AnswerSchema = new Schema({
    questionId: { type: String, required: true },
    answer: { type: String, required: true },
    answeredAt: { type: Date, default: Date.now },
    timeSpent: { type: Number, default: 0 },
    evaluation: {
        score: Number,
        maxScore: Number,
        feedback: String,
        strengths: [String],
        improvements: [String],
        evaluatedAt: Date,
        evaluatedBy: { type: String, enum: ['ai', 'human'] },
        evaluatorId: String
    }
});

const InterviewSchema = new Schema({
    organizationId: { type: String, required: true, index: true },
    jobId: { type: String, required: true, index: true },
    candidateId: { type: String, required: true, index: true },
    interviewType: {
        type: String,
        enum: ['screening', 'technical', 'behavioral', 'final'],
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },

    scheduledAt: Date,
    startedAt: Date,
    completedAt: Date,
    duration: { type: Number, default: 30 },

    questions: [QuestionSchema],
    answers: [AnswerSchema],
    conversationHistory: [{
        role: { type: String, enum: ['ai', 'candidate'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],

    totalScore: { type: Number, default: 0 },
    maxScore: { type: Number, default: 100 },
    percentageScore: { type: Number, default: 0 },
    breakdown: {
        technical: Number,
        behavioral: Number,
        communication: Number,
        problemSolving: Number
    },

    aiModel: { type: String, default: 'gemini-pro' },
    adaptiveDifficulty: { type: Boolean, default: true },

    overallFeedback: String,
    recommendation: {
        type: String,
        enum: ['strong_hire', 'hire', 'maybe', 'no_hire']
    },
    evaluatedBy: String,
}, {
    timestamps: true
});

// Indexes
InterviewSchema.index({ organizationId: 1, jobId: 1 });
InterviewSchema.index({ candidateId: 1, status: 1 });
InterviewSchema.index({ scheduledAt: 1 });

export default mongoose.model<IInterview>('Interview', InterviewSchema);
