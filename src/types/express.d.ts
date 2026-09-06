// Declaration merging so route handlers can read `req.user` after `validateJWT`.

import "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}
