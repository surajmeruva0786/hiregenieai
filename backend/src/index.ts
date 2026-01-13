import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';
import { setupWebSocket } from './websocket';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for WebSocket
const httpServer = createServer(app);

// Setup WebSocket
const io = setupWebSocket(httpServer);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'healthy',
        mode: 'localStorage',
        message: 'Running in localStorage mode - no database required',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        websocket: 'enabled',
    });
});

// API Routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server without database connections
const startServer = async () => {
    try {
        logger.info('🎯 Starting in localStorage mode (no database required)');

        // Start server with WebSocket support
        httpServer.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
            logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
            logger.info(`💾 Data persistence: localStorage (client-side)`);
            logger.info(`🔌 WebSocket: enabled`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

startServer();

export default app;

