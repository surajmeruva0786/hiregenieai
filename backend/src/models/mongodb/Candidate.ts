import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill {
    name: string;
    confidence: number;
    source: 'extracted' | 'manual';
}

export interface IExperience {
    company: string;
    title: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    description: string;
    skills: string[];
}

export interface IEducation {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    grade?: string;
}

export interface IProject {
    title: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface ICandidate extends Document {
    organizationId: string;
    userId?: string; // If candidate has registered as student
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    location?: string;
    resumeUrl: string;
    resumeId: string;

    // Parsed data
    skills: ISkill[];
    experience: IExperience[];
    education: IEducation[];
    projects: IProject[];
    totalExperienceYears: number;

    // Embeddings
    resumeEmbedding?: number[];
    embeddingModel?: string;

    // Applications
    appliedJobs: Array<{
        jobId: string;
        appliedAt: Date;
        status: string;
        matchScore?: number;
    }>;

    // Metadata
    source: 'upload' | 'application' | 'manual';
    tags: string[];
    notes: string;

    createdAt: Date;
    updatedAt: Date;
}

const SkillSchema = new Schema({
    name: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 1, default: 1 },
    source: { type: String, enum: ['extracted', 'manual'], default: 'extracted' }
});

const ExperienceSchema = new Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    isCurrent: { type: Boolean, default: false },
    description: String,
    skills: [String]
});

const EducationSchema = new Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: String,
    startDate: Date,
    endDate: Date,
    grade: String
});

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    technologies: [String],
    url: String,
    startDate: Date,
    endDate: Date
});

const CandidateSchema = new Schema({
    organizationId: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    email: { type: String, required: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    location: String,
    resumeUrl: { type: String, required: true },
    resumeId: { type: String, required: true },

    skills: [SkillSchema],
    experience: [ExperienceSchema],
    education: [EducationSchema],
    projects: [ProjectSchema],
    totalExperienceYears: { type: Number, default: 0 },

    resumeEmbedding: [Number],
    embeddingModel: String,

    appliedJobs: [{
        jobId: { type: String, required: true },
        appliedAt: { type: Date, default: Date.now },
        status: { type: String, default: 'applied' },
        matchScore: Number
    }],

    source: { type: String, enum: ['upload', 'application', 'manual'], default: 'upload' },
    tags: [String],
    notes: String,
}, {
    timestamps: true
});

// Indexes
CandidateSchema.index({ organizationId: 1, email: 1 }, { unique: true });
CandidateSchema.index({ 'skills.name': 1 });
CandidateSchema.index({ 'appliedJobs.jobId': 1 });

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);
