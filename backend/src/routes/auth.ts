import { Router, Request, Response } from 'express';
import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';

import {prisma} from '../db';
import { error } from 'node:console';

const router = Router();

router.get('/register', async (_req: Request, res: Response) => {
    const {username, password} = _req.body;

    if(!username || !password) {
        return res.status(400).json({error: 'Username and password are required'});
    }

    try {
        const salt = genSaltSync(10);
        
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: password,
            }
        });

        res.status(201).json(newUser);
    }catch(e: unknown) {
        if(e instanceof Error) {
            console.log('Database error: ', e.message);

            if(e.message.includes('Unique constraint failed')) {
                return res.status(409).json({error: 'Username already exists'});
            }
            if(e.message.includes('Validation error')) {
                return res.status(400).json({error: 'Invalid input data'});
            }

            return res.status(500).json({error: 'Internal server error: '+e.message});
        }

        return res.status(500).json({error: 'Unknown error occurred'});
    }
});

export default router;