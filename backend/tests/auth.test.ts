import request from 'supertest';
import app from '../src/index';

describe('Authentication API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user and organization', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'TestPass123!',
                    firstName: 'Test',
                    lastName: 'User',
                    organizationName: 'Test Org',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
        });

        it('should fail with invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'TestPass123!',
                    firstName: 'Test',
                    lastName: 'User',
                    organizationName: 'Test Org',
                });

            expect(response.status).toBe(400);
        });

        it('should fail with weak password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test2@example.com',
                    password: '123',
                    firstName: 'Test',
                    lastName: 'User',
                    organizationName: 'Test Org',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            // First register
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'login@example.com',
                    password: 'TestPass123!',
                    firstName: 'Login',
                    lastName: 'User',
                    organizationName: 'Login Org',
                });

            // Then login
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'TestPass123!',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
        });

        it('should fail with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'WrongPass123!',
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/auth/me', () => {
        it('should return current user with valid token', async () => {
            // Register and get token
            const registerResponse = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'me@example.com',
                    password: 'TestPass123!',
                    firstName: 'Me',
                    lastName: 'User',
                    organizationName: 'Me Org',
                });

            const token = registerResponse.body.data.accessToken;

            // Get current user
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe('me@example.com');
        });

        it('should fail without token', async () => {
            const response = await request(app).get('/api/auth/me');

            expect(response.status).toBe(401);
        });
    });
});
