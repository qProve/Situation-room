import { Router, Request, Response } from 'express';
import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';
import { sign as jwtSign } from 'jsonwebtoken';
import dotenv from 'dotenv';

import { prisma } from '../db';

dotenv.config();
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
}

const router = Router();

router.post('/register', async (_req: Request, res: Response) => {
    const { username, password } = _req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
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
            console.log('Error: ', e.message);

            if (e.message.includes('Unique constraint failed')) {
                return res.status(409).json({ error: 'Username already exists' });
            }
            if (e.message.includes('Validation error')) {
                return res.status(400).json({ error: 'Invalid input data' });
            }

            return res.status(500).json({ error: 'Internal server error: ' + e.message });
        }

        return res.status(500).json({ error: 'Unknown error occurred' });
    }
});

router.post('/login', async (_req: Request, res: Response) => {
    const { username, password } = _req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userPassword = user.password;
        if (!compareSync(password, userPassword)) {
            return res.status(401).json({ message: 'Password does not match' });
        }

        const token = jwtSign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.log('Error: ', e.message);

            return res.status(500).json({ error: 'Internal server error: ' + e.message });
        }

        return res.status(500).json({ error: 'Unknown error occurred' });
    }
});

export default router;
