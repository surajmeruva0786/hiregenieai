import { Pool } from 'pg';
import { logger } from '../utils/logger';

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const connectPostgres = async (): Promise<void> => {
    try {
        const client = await pool.connect();
        logger.info('✅ PostgreSQL connected successfully');
        client.release();
    } catch (error) {
        logger.error('❌ PostgreSQL connection failed:', error);
        throw error;
    }
};

export const query = async (text: string, params?: any[]) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        logger.debug('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        logger.error('Query error:', { text, error });
        throw error;
    }
};

export const getClient = () => pool.connect();

export default pool;
