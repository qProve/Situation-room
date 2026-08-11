import { Request, Response, NextFunction } from 'express';
import { verify as jwtVerify } from 'jsonwebtoken';
import dotenv from 'dotenv';

import { UserJwtPayload } from '../types/userJwtPayload.interface';

dotenv.config();
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
}

export const auth = (_req: Request, res: Response, _next: NextFunction) => {
    const authHeader = _req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwtVerify(token, process.env.JWT_SECRET) as unknown as UserJwtPayload;
        _req.user = { userId: decode.userId };
        _next();
    } catch (e: unknown) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
