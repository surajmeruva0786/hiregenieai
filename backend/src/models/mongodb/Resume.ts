import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
    organizationId: string;
    candidateId?: string;

    // File information
    originalFilename: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;

    // Processing status
    status: 'pending' | 'processing' | 'completed' | 'failed';
    processingStartedAt?: Date;
    processingCompletedAt?: Date;
    errorMessage?: string;

    // Raw content
    rawText: string;

    // Parsed sections
    parsedData: {
        personalInfo?: {
            name?: string;
            email?: string;
            phone?: string;
            location?: string;
            linkedin?: string;
            github?: string;
            portfolio?: string;
        };
        summary?: string;
        skills?: string[];
        experience?: Array<{
            company: string;
            title: string;
            duration: string;
            description: string;
        }>;
        education?: Array<{
            institution: string;
            degree: string;
            field: string;
            year: string;
        }>;
        projects?: Array<{
            title: string;
            description: string;
            technologies: string[];
        }>;
        certifications?: Array<{
            name: string;
            issuer: string;
            date: string;
        }>;
        languages?: string[];
    };

    // Metadata
    uploadedBy?: string;
    uploadedAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

const ResumeSchema = new Schema({
    organizationId: { type: String, required: true, index: true },
    candidateId: { type: String, index: true },

    originalFilename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },

    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
        index: true
    },
    processingStartedAt: Date,
    processingCompletedAt: Date,
    errorMessage: String,

    rawText: String,

    parsedData: {
        personalInfo: {
            name: String,
            email: String,
            phone: String,
            location: String,
            linkedin: String,
            github: String,
            portfolio: String
        },
        summary: String,
        skills: [String],
        experience: [{
            company: String,
            title: String,
            duration: String,
            description: String
        }],
        education: [{
            institution: String,
            degree: String,
            field: String,
            year: String
        }],
        projects: [{
            title: String,
            description: String,
            technologies: [String]
        }],
        certifications: [{
            name: String,
            issuer: String,
            date: String
        }],
        languages: [String]
    },

    uploadedBy: String,
    uploadedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

// Indexes
ResumeSchema.index({ organizationId: 1, status: 1 });
ResumeSchema.index({ candidateId: 1 });
ResumeSchema.index({ uploadedAt: -1 });

export default mongoose.model<IResume>('Resume', ResumeSchema);
