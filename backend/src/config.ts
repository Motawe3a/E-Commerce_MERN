// Centralised runtime configuration. Values come from the environment
// (loaded from .env via `dotenv/config` in index.ts) with dev-friendly fallbacks.

export const PORT = process.env.PORT || 3001;

export const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

export const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret";

// Origin allowed to call this API from a browser (the frontend dev server).
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
