import { createClient } from 'redis';
import { logger } from '../utils/logger';

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    password: process.env.REDIS_PASSWORD || undefined,
});

export const connectRedis = async (): Promise<void> => {
    try {
        await redisClient.connect();
        logger.info('✅ Redis connected successfully');

        redisClient.on('error', (error) => {
            logger.error('Redis error:', error);
        });

        redisClient.on('reconnecting', () => {
            logger.warn('Redis reconnecting...');
        });

    } catch (error) {
        logger.error('❌ Redis connection failed:', error);
        throw error;
    }
};

export default redisClient;
