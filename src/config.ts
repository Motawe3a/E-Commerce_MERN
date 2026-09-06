// Centralised runtime configuration. Values come from the environment
// (loaded from .env via `dotenv/config` in index.ts) with dev-friendly fallbacks.

export const PORT = process.env.PORT || 3001;

export const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

export const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret";
