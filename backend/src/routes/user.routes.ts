import { Router, Request, Response } from 'express';

import { auth } from '../middleware/auth.middleware';

const router = Router();

router.get('/test-private', auth, async (_req: Request, res: Response) => {
    res.json({ message: 'I work!' });
});

export default router;
