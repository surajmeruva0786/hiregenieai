import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/postgres';
import { JWTService } from '../auth/jwt.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

/**
 * Register new user and organization
 */
export const register = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const {
            email,
            password,
            firstName,
            lastName,
            organizationName,
            role = 'admin',
        } = req.body;

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            throw new AppError('Missing required fields', 400);
        }

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            throw new AppError('User already exists', 409);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create organization if provided
        let organizationId: string;

        if (organizationName) {
            const orgSlug = organizationName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            const orgResult = await query(
                `INSERT INTO organizations (name, slug, email) 
         VALUES ($1, $2, $3) 
         RETURNING id`,
                [organizationName, orgSlug, email]
            );

            organizationId = orgResult.rows[0].id;
        } else {
            throw new AppError('Organization name is required', 400);
        }

        // Create user
        const userResult = await query(
            `INSERT INTO users (organization_id, email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, first_name, last_name, role, organization_id`,
            [organizationId, email, passwordHash, firstName, lastName, role]
        );

        const user = userResult.rows[0];

        // Generate tokens
        const tokens = JWTService.generateTokens({
            userId: user.id,
            email: user.email,
            organizationId: user.organization_id,
            role: user.role,
        });

        logger.info(`User registered: ${email}`);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role,
                    organizationId: user.organization_id,
                },
                ...tokens,
            },
        });
    }
);

/**
 * Login user
 */
export const login = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            throw new AppError('Email and password are required', 400);
        }

        // Find user
        const result = await query(
            `SELECT id, email, password_hash, first_name, last_name, role, organization_id, is_active 
       FROM users 
       WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            throw new AppError('Invalid credentials', 401);
        }

        const user = result.rows[0];

        // Check if user is active
        if (!user.is_active) {
            throw new AppError('Account is deactivated', 403);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        // Update last login
        await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [
            user.id,
        ]);

        // Generate tokens
        const tokens = JWTService.generateTokens({
            userId: user.id,
            email: user.email,
            organizationId: user.organization_id,
            role: user.role,
        });

        logger.info(`User logged in: ${email}`);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role,
                    organizationId: user.organization_id,
                },
                ...tokens,
            },
        });
    }
);

/**
 * Refresh access token
 */
export const refreshToken = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('Refresh token is required', 400);
        }

        // Verify refresh token
        const payload = JWTService.verifyRefreshToken(refreshToken);

        // Generate new access token
        const newAccessToken = JWTService.generateAccessToken({
            userId: payload.userId,
            email: payload.email,
            organizationId: payload.organizationId,
            role: payload.role,
        });

        res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken,
            },
        });
    }
);

/**
 * Logout user (client-side token removal)
 */
export const logout = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        // In a more advanced implementation, you would blacklist the token
        // For now, we rely on client-side token removal

        logger.info(`User logged out: ${req.user?.email}`);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    }
);

/**
 * Get current user
 */
export const getCurrentUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const result = await query(
            `SELECT id, email, first_name, last_name, role, organization_id, avatar_url, created_at 
       FROM users 
       WHERE id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        const user = result.rows[0];

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                organizationId: user.organization_id,
                avatarUrl: user.avatar_url,
                createdAt: user.created_at,
            },
        });
    }
);
