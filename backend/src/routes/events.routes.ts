import { Router, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import { NASA_EONET_EVENTS_URL, USGS_EARTHQUAKE_URL } from '../constants/urls';

const router = Router();

// Call retry
axiosRetry(axios, {
    retries: 8,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (e) => e.response?.status == 503,
});

router.get('/nasa', async (_req: Request, res: Response) => {
    try {
        const response = await axios.get(NASA_EONET_EVENTS_URL);
        res.json(response.data);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            const status = e.response?.status || 500;
            const message = e.response?.data?.message || 'Unknown error from NASA servers';

            res.status(status).json({ error: message });
        } else {
            console.log('Error while downloading data: ', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

router.get('/usgs', async (_req: Request, res: Response) => {
    try {
        const response = await axios.get(USGS_EARTHQUAKE_URL);
        res.json(response.data);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            const status = e.response?.status || 500;
            const message = e.response?.data.message || 'Unknown error from USGS servers';

            res.status(status).json({ error: message });
        } else {
            console.log('Error while downloading data: ', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

export default router;
