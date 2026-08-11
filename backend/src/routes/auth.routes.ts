import { Router, Request, Response } from 'express';
import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';
import { sign as jwtSign } from 'jsonwebtoken';
import dotenv from 'dotenv';

import { prisma } from '../db';
import { authRateLimit } from '../middleware/rateLimit.middleware';

dotenv.config();
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
}

const router = Router();

router.post('/register', authRateLimit, async (_req: Request, res: Response) => {
    const { username, password } = _req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    if (typeof username !== 'string' || username.length > 63 || username.length < 3) {
        return res
            .status(400)
            .json({ error: 'Username has to be min 3 and max 63 characters long' });
    }
    if (typeof password !== 'string' || password.length > 255 || password.length < 4) {
        return res
            .status(400)
            .json({ error: 'Password has to be min 4 and max 255 characters long' });
    }

    try {
        const salt = genSaltSync(10);
        const passwordHash = hashSync(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: passwordHash,
            },
        });

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (e: unknown) {
        if (e instanceof Error) {
            if (e.message.includes('Unique constraint failed')) {
                return res.status(409).json({ error: 'Username already exists' });
            }
            if (e.message.includes('Validation error')) {
                return res.status(400).json({ error: 'Invalid input data' });
            }

            console.error('Register error: ' + e.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(500).json({ error: 'Unknown error occurred' });
    }
});

router.post('/login', authRateLimit, async (_req: Request, res: Response) => {
    const { username, password } = _req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userPassword = user.password;
        if (!compareSync(password, userPassword)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwtSign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error('Login error: ' + e.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(500).json({ error: 'Unknown error occurred' });
    }
});

export default router;
