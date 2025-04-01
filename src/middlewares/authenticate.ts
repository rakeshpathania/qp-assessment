import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errorHandlers.js';
import { AdminAuthService } from '../services/adminAuthService.js';
import { UserAuthService } from '../services/userAuthService.js';
import { logger } from '../utils/errorHandlers.js';
import { AppDataSource } from '../database/dataSource.js';

interface JWTPayload {
    id: string;
    [key: string]: any;
}

export interface RequestWithUser extends Request {
    user?: any;
    admin?: any;
}

const APP_SECRET = process.env.APP_SECRET as string;
const adminService = new AdminAuthService(AppDataSource);
const userService = new UserAuthService(AppDataSource);

const validateSignature = async (req: Request): Promise<JWTPayload | null> => {
    try {
        const token: string | undefined =
            req.headers.authorization?.startsWith('Bearer ')
                ? req.headers.authorization.split(' ')[1]
                : req.cookies?.token;

        if (!token) {
            throw new UnauthorizedError('No token provided');
        }

        // Check if token is blacklisted
        const isblacklistedToken = await adminService.getBlacklistedToken(token);
        if (isblacklistedToken) {
            throw new UnauthorizedError('Token is blacklisted');
        }

        // Verify JWT
        const payload = jwt.verify(token, APP_SECRET) as JWTPayload;
        if (!payload?.id) {
            throw new UnauthorizedError('Invalid token payload');
        }

        return payload;
    } catch (error: any) {
        logger.error(
            error instanceof jwt.JsonWebTokenError
                ? `JWT Error: ${error.message}`
                : `Auth Error: ${error.message}`
        );
        return null;
    }
};

export const adminAuthenticate = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const payload = await validateSignature(req);
    if (!payload?.isAdmin) {
        return next(new UnauthorizedError('Unauthorized'));
    }

    try {
        const admin = await adminService.getAdminById(Number(payload?.id));
        if (!admin) {
            throw new UnauthorizedError('Admin not found');
        }

        req.admin = admin;
        return next();
    } catch (error: any) {
        logger.error('Admin Authentication Error:', error.message);
        return next(new UnauthorizedError('Unauthorized'));
    }
};

export const userAuthenticate = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const payload = await validateSignature(req);
    if (!payload) {
        return next(new UnauthorizedError('Unauthorized'));
    }

    try {
        const user = await userService.getUserById(Number(payload?.id));
        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        req.user = user;
        return next();
    } catch (error: any) {
        logger.error('User Authentication Error:', error.message);
        return next(new UnauthorizedError('Unauthorized'));
    }
};
