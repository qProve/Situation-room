import { Router, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import {
    NASA_EONET_EVENTS_URL,
    OPENSKY_URL,
    TRAINSTRACKING_URL,
    USGS_EARTHQUAKE_URL,
} from '../constants/urls';

const router = Router();

// Call retry
axiosRetry(axios, {
    retries: 8,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (e) => e.response?.status == 503,
});

router.get('/eonet', async (_req: Request, res: Response) => {
    try {
        const response = await axios.get(NASA_EONET_EVENTS_URL);
        res.json(response.data);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            const status = e.response?.status || 500;
            const message = e.response?.data?.message || 'Unknown error from EONET servers';

            res.status(status).json({ error: message });
        } else {
            console.log('Error while downloading data (EONET): ', e);
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
            console.log('Error while downloading data (USGS): ', e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

router.get('/opensky', async (_req: Request, res: Response) => {
    try {
        const response = await axios.get(OPENSKY_URL);
        res.json(response.data);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            const status = e.response?.status || 500;
            const message = e.response?.data.message || 'Unknown error from OpenSky servers';

            res.status(status).json({ error: message });
        } else {
            console.log('Error while downloading data (OpenSky): ', e);
        }
    }
});

router.get('/trainstracking', async (_req: Request, res: Response) => {
    try {
        const response = await axios.get(TRAINSTRACKING_URL);
        res.json(response.data);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            const status = e.response?.status || 500;
            const message = e.response?.data.message || 'Unknown error from TrainsTracking servers';

            res.status(status).json({ error: message });
        } else {
            console.log('Error while downloading data (TrainsTracking): ', e);
        }
    }
});

export default router;
