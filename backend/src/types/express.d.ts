import { JwtPayload } from 'jsonwebtoken';

import UserJwtPayload from './userJwtPayload.interface';

declare global {
    namespace Express {
        interface Request {
            user?: UserJwtPayload;
        }
    }
}
