import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../middleware/error.middleware';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPayload {
    userId: string;
    email: string;
    organizationId: string;
    role: string;
}

export class JWTService {
    /**
     * Generate access token
     */
    static generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        } as SignOptions);
    }

    /**
     * Generate refresh token
     */
    static generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRES_IN,
        } as SignOptions);
    }

    /**
     * Generate both access and refresh tokens
     */
    static generateTokens(payload: TokenPayload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    /**
     * Verify access token
     */
    static verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError('Token expired', 401);
            }
            throw new AppError('Invalid token', 401);
        }
    }

    /**
     * Verify refresh token
     */
    static verifyRefreshToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError('Refresh token expired', 401);
            }
            throw new AppError('Invalid refresh token', 401);
        }
    }

    /**
     * Decode token without verification (for debugging)
     */
    static decodeToken(token: string): any {
        return jwt.decode(token);
    }
}
