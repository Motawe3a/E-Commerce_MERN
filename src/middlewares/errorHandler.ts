import { NextFunction, Request, RequestHandler, Response } from "express";

// Wrap an async route handler so any thrown/rejected error is forwarded to the
// global error handler instead of crashing the process. Expected outcomes are
// still expressed through the `{ data, statusCode }` envelope in the services.
export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
    (req, res, next) => {
        fn(req, res, next).catch(next);
    };

export const notFound: RequestHandler = (_req, res) => {
    res.status(404).send({ message: "Route not found" });
};

interface HttpError extends Error {
    status?: number;
}

export const errorHandler = (
    err: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const status = err.status || 500;
    if (status >= 500) {
        console.error(err);
    }
    res.status(status).send({ message: err.message || "Internal server error" });
};
