// Test setup file
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    // Start in-memory MongoDB for testing
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
});

afterAll(async () => {
    // Stop MongoDB
    if (mongoServer) {
        await mongoServer.stop();
    }
});

afterEach(async () => {
    // Clean up database after each test
    // This would clear all collections
});
