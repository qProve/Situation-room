import rateLimit from "express-rate-limit";
import { error } from "node:console";

export const authRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    message: { error: 'Too many attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false
});