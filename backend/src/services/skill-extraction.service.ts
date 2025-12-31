import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class SkillExtractionService {
    /**
     * Extract skills from resume text using Gemini AI
     */
    static async extractSkills(resumeText: string): Promise<Array<{ name: string; confidence: number }>> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
You are an expert resume analyzer. Extract all technical and professional skills from the following resume.

For each skill, provide:
1. The skill name (normalized and standardized)
2. A confidence score (0.0 to 1.0) based on how explicitly it's mentioned

Return ONLY a JSON array in this exact format:
[
  {"name": "JavaScript", "confidence": 0.95},
  {"name": "React", "confidence": 0.90},
  {"name": "Node.js", "confidence": 0.85}
]

Rules:
- Normalize skill names (e.g., "JS" -> "JavaScript", "ReactJS" -> "React")
- Higher confidence for skills in dedicated skills section
- Medium confidence for skills mentioned in experience
- Lower confidence for implied skills
- Include programming languages, frameworks, tools, methodologies, soft skills
- Limit to top 30 most relevant skills

Resume:
${resumeText}

JSON Array:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                logger.warn('Failed to extract JSON from Gemini response');
                return [];
            }

            const skills = JSON.parse(jsonMatch[0]);
            return skills;
        } catch (error) {
            logger.error('Skill extraction error:', error);
            return [];
        }
    }

    /**
     * Extract structured experience data
     */
    static async extractExperience(resumeText: string): Promise<any[]> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
Extract work experience from this resume. Return ONLY a JSON array:

[
  {
    "company": "Company Name",
    "title": "Job Title",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM" or null if current,
    "isCurrent": true/false,
    "description": "Brief description",
    "skills": ["skill1", "skill2"]
  }
]

Resume:
${resumeText}

JSON Array:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) return [];

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            logger.error('Experience extraction error:', error);
            return [];
        }
    }

    /**
     * Extract education data
     */
    static async extractEducation(resumeText: string): Promise<any[]> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
Extract education from this resume. Return ONLY a JSON array:

[
  {
    "institution": "University Name",
    "degree": "Bachelor of Science",
    "field": "Computer Science",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM",
    "grade": "GPA or grade if mentioned"
  }
]

Resume:
${resumeText}

JSON Array:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) return [];

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            logger.error('Education extraction error:', error);
            return [];
        }
    }

    /**
     * Extract projects
     */
    static async extractProjects(resumeText: string): Promise<any[]> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
Extract projects from this resume. Return ONLY a JSON array:

[
  {
    "title": "Project Name",
    "description": "Brief description",
    "technologies": ["tech1", "tech2"],
    "url": "project URL if mentioned"
  }
]

Resume:
${resumeText}

JSON Array:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) return [];

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            logger.error('Projects extraction error:', error);
            return [];
        }
    }

    /**
     * Extract personal info
     */
    static async extractPersonalInfo(resumeText: string): Promise<any> {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = `
Extract personal information from this resume. Return ONLY a JSON object:

{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "City, State/Country",
  "linkedin": "LinkedIn URL",
  "github": "GitHub URL",
  "portfolio": "Portfolio URL"
}

Resume:
${resumeText}

JSON Object:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) return {};

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            logger.error('Personal info extraction error:', error);
            return {};
        }
    }
}
