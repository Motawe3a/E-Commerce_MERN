import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

export const validateJWT: RequestHandler = (req, res, next) => {
    const header = req.get("authorization");

    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).send({ message: "Missing or malformed Authorization header" });
        return;
    }

    const token = header.slice("Bearer ".length);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    } catch {
        res.status(401).send({ message: "Invalid or expired token" });
    }
};

export const requireAdmin: RequestHandler = (req, res, next) => {
    if (req.user?.role !== "admin") {
        res.status(403).send({ message: "Admin access required" });
        return;
    }
    next();
};
