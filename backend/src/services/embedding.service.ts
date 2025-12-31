import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class EmbeddingService {
    /**
     * Generate embedding for resume text
     */
    static async generateEmbedding(text: string): Promise<number[]> {
        try {
            const model = genAI.getGenerativeModel({ model: 'embedding-001' });

            const result = await model.embedContent(text);
            const embedding = result.embedding;

            return embedding.values;
        } catch (error) {
            logger.error('Embedding generation error:', error);
            throw new Error('Failed to generate embedding');
        }
    }

    /**
     * Calculate cosine similarity between two embeddings
     */
    static cosineSimilarity(embedding1: number[], embedding2: number[]): number {
        if (embedding1.length !== embedding2.length) {
            throw new Error('Embeddings must have the same length');
        }

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < embedding1.length; i++) {
            dotProduct += embedding1[i] * embedding2[i];
            norm1 += embedding1[i] * embedding1[i];
            norm2 += embedding2[i] * embedding2[i];
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    /**
     * Find most similar candidates
     */
    static findMostSimilar(
        targetEmbedding: number[],
        candidateEmbeddings: Array<{ candidateId: string; embedding: number[] }>,
        topK: number = 10
    ): Array<{ candidateId: string; similarity: number }> {
        const similarities = candidateEmbeddings.map((candidate) => ({
            candidateId: candidate.candidateId,
            similarity: this.cosineSimilarity(targetEmbedding, candidate.embedding),
        }));

        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    }
}
