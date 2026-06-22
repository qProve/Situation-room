import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import eventsRouter from './routes/events';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/auth', authRouter);

app.get('/', (_req: Request, res: Response) => {
    res.send("Situation Room");
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
