import { Request, Response, NextFunction } from 'express';
import { JWTService, TokenPayload } from '../auth/jwt.service';
import { AppError } from './error.middleware';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

/**
 * Middleware to verify JWT token
 */
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const payload = JWTService.verifyAccessToken(token);

        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware to check user role
 */
export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError('Unauthorized', 401);
            }

            if (!allowedRoles.includes(req.user.role)) {
                throw new AppError('Forbidden: Insufficient permissions', 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Middleware to ensure user belongs to the organization
 */
export const checkOrganization = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Unauthorized', 401);
        }

        const organizationId = req.params.organizationId || req.body.organizationId;

        if (organizationId && organizationId !== req.user.organizationId) {
            throw new AppError('Forbidden: Access to different organization denied', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = JWTService.verifyAccessToken(token);
            req.user = payload;
        }

        next();
    } catch (error) {
        // Don't fail, just continue without user
        next();
    }
};
