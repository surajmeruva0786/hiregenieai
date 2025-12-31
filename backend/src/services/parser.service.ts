import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import { logger } from '../utils/logger';

export class ResumeParserService {
    /**
     * Parse PDF file
     */
    static async parsePDF(filePath: string): Promise<string> {
        try {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            logger.error('PDF parsing error:', error);
            throw new Error('Failed to parse PDF file');
        }
    }

    /**
     * Parse DOC/DOCX file
     */
    static async parseDOCX(filePath: string): Promise<string> {
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } catch (error) {
            logger.error('DOCX parsing error:', error);
            throw new Error('Failed to parse DOCX file');
        }
    }

    /**
     * Parse resume based on file type
     */
    static async parseResume(filePath: string, fileType: string): Promise<string> {
        if (fileType === 'application/pdf') {
            return this.parsePDF(filePath);
        } else if (
            fileType === 'application/msword' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return this.parseDOCX(filePath);
        } else {
            throw new Error('Unsupported file type');
        }
    }

    /**
     * Clean and normalize text
     */
    static cleanText(text: string): string {
        return text
            .replace(/\r\n/g, '\n') // Normalize line endings
            .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
            .replace(/\s{2,}/g, ' ') // Remove excessive spaces
            .trim();
    }

    /**
     * Extract email from text
     */
    static extractEmail(text: string): string | null {
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
        const match = text.match(emailRegex);
        return match ? match[0] : null;
    }

    /**
     * Extract phone number from text
     */
    static extractPhone(text: string): string | null {
        const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
        const match = text.match(phoneRegex);
        return match ? match[0] : null;
    }

    /**
     * Extract LinkedIn URL
     */
    static extractLinkedIn(text: string): string | null {
        const linkedInRegex = /linkedin\.com\/in\/[\w-]+/i;
        const match = text.match(linkedInRegex);
        return match ? `https://${match[0]}` : null;
    }

    /**
     * Extract GitHub URL
     */
    static extractGitHub(text: string): string | null {
        const githubRegex = /github\.com\/[\w-]+/i;
        const match = text.match(githubRegex);
        return match ? `https://${match[0]}` : null;
    }

    /**
     * Detect sections in resume
     */
    static detectSections(text: string): {
        summary?: string;
        experience?: string;
        education?: string;
        skills?: string;
        projects?: string;
    } {
        const sections: any = {};

        // Common section headers
        const sectionPatterns = {
            summary: /(?:summary|profile|objective|about me)(.*?)(?=\n(?:experience|education|skills|projects)|$)/is,
            experience: /(?:experience|work history|employment)(.*?)(?=\n(?:education|skills|projects)|$)/is,
            education: /(?:education|academic|qualifications)(.*?)(?=\n(?:experience|skills|projects)|$)/is,
            skills: /(?:skills|technical skills|competencies)(.*?)(?=\n(?:experience|education|projects)|$)/is,
            projects: /(?:projects|portfolio)(.*?)(?=\n(?:experience|education|skills)|$)/is,
        };

        for (const [section, pattern] of Object.entries(sectionPatterns)) {
            const match = text.match(pattern);
            if (match && match[1]) {
                sections[section] = match[1].trim();
            }
        }

        return sections;
    }

    /**
     * Calculate years of experience from text
     */
    static calculateExperience(experienceText: string): number {
        // Look for year patterns like "2020 - 2023" or "Jan 2020 - Present"
        const yearRanges = experienceText.match(/(\d{4})\s*[-–]\s*(?:(\d{4})|present|current)/gi);

        if (!yearRanges) return 0;

        let totalYears = 0;
        const currentYear = new Date().getFullYear();

        yearRanges.forEach((range) => {
            const years = range.match(/\d{4}/g);
            if (years && years.length > 0) {
                const startYear = parseInt(years[0]);
                const endYear = years[1] ? parseInt(years[1]) : currentYear;
                totalYears += endYear - startYear;
            }
        });

        return Math.max(0, totalYears);
    }
}
