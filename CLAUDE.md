# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

- `backend/` — the Express 5 + Mongoose + TypeScript API described below. All backend commands run from inside `backend/`.
- `frontend/` — the web client: Vite + React 19 + TypeScript, Tailwind CSS v4, React Router 7, TanStack Query, Axios. See `frontend/README.md`. Dev server on `http://localhost:5173`; it talks to the backend at `VITE_API_URL` (default `http://localhost:3001`). The app is members-only — only `/login` and `/register` are public, everything else is behind a `RequireAuth` gate. It ships an EN/AR language switch (full RTL) and a light/dark theme.

## Deployment

Deployed 100% free; see [DEPLOY.md](DEPLOY.md) for the walkthrough.

- **Frontend → GitHub Pages** via [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml): `npm ci && npm run build` in `frontend/` with `VITE_API_URL` from the repo **variable** of the same name, then `actions/deploy-pages`. Runs on pushes touching `frontend/**` and on manual dispatch. Live at `https://motawe3a.github.io/E-Commerce_MERN/`.
- **Backend → Render** free web service via [render.yaml](render.yaml) (Blueprint): `rootDir: backend`, `npm ci` / `npm start`. Prompts for `MONGO_URI` and `CLIENT_URL`; generates `JWT_SECRET`. Free instances sleep after ~15 min idle.
- **Database → MongoDB Atlas** M0 (free).

## What this is

The `backend/` service is a backend-only API: Express 5 + Mongoose + TypeScript, run directly through `ts-node` (no build step, no compiled output). It implements a minimal storefront flow: auth → browse products → per-user cart → checkout into an order (mock payment) → view orders, plus admin product CRUD.

## Commands

Run from `backend/`:

- `npm run dev` — start the server via nodemon, which runs `ts-node ./src/index.ts` and restarts on any `.ts` change under `src/`.
- `npm start` — production entrypoint (`ts-node --transpile-only ./src/index.ts`, no restart, no type-check); this is what Render runs.
- `npx tsc --noEmit` — type-check the whole project (no script wired for it; there is no linter or test runner).
- To run the server ad hoc on another port: `PORT=3999 npx ts-node ./src/index.ts`.

Requires a local MongoDB reachable at `MONGO_URI` (default `mongodb://localhost:27017/ecommerce`). The server still starts and listens even if the Mongo connection fails — failures are only logged, and product seeding is skipped.

The frontend runs from `frontend/`: `npm run dev` (Vite, port 5173), `npm run build` (`tsc -b && vite build`, then a `postbuild` copies `dist/index.html` → `dist/404.html` for GitHub Pages SPA fallback).

## Configuration

Runtime config lives in [backend/src/config.ts](backend/src/config.ts), read from environment variables (loaded from `.env` via `import "dotenv/config"` at the top of [backend/src/index.ts](backend/src/index.ts)): `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (browser origin allowed by CORS — `app.use(cors({ origin: CLIENT_URL }))`, default `http://localhost:5173`). All have dev fallbacks, so the app runs with no `.env`. Copy [backend/.env.example](backend/.env.example) to `backend/.env` for real values.

## Architecture

Three layers, one direction of dependency: **routes → services → models**.

- **Models** ([backend/src/models/](backend/src/models/)) — Mongoose schemas plus their `Document` interfaces (`IUser`, `IProduct`, `ICart`, `IOrder`). Default-exported model, named-exported interface(s). All schemas use `{ timestamps: true }`.
- **Services** ([backend/src/services/](backend/src/services/)) — all business logic. Service functions do **not** touch `req`/`res`. Instead they return an envelope object `{ data, statusCode }`, and the route forwards it with `res.status(result.statusCode).send(result.data)`. Keep new service functions to this contract. Unexpected throws are handled separately (see below); the envelope is only for expected outcomes (validation, not-found, etc.).
- **Routes** ([backend/src/routes/](backend/src/routes/)) — thin Express routers. Each handler is wrapped in `asyncHandler` from [backend/src/middlewares/errorHandler.ts](backend/src/middlewares/errorHandler.ts) so rejected promises reach the global error handler. Registered in [backend/src/index.ts](backend/src/index.ts); `notFound` + `errorHandler` are mounted **last**.

### Auth

- [backend/src/middlewares/authMiddleware.ts](backend/src/middlewares/authMiddleware.ts): `validateJWT` reads `Authorization: Bearer <token>`, verifies with `JWT_SECRET`, and attaches `req.user = { id, email, role }` (type declared in [backend/src/types/express.d.ts](backend/src/types/express.d.ts)). `requireAdmin` gates admin-only routes on `req.user.role === "admin"`.
- Tokens are minted by `generateJWT` in [backend/src/services/userService.ts](backend/src/services/userService.ts) (payload `{ id, email, role }`, 24h expiry).
- `role` on the user is `"user"` by default; there is no endpoint to grant `"admin"` — promote a user directly in Mongo.

### Routes overview

- `/users` — `POST /register`, `POST /login` (public).
- `/products` — `GET /`, `GET /:id` public; `POST /`, `PUT /:id`, `DELETE /:id` require `validateJWT` + `requireAdmin`.
- `/cart` — all require `validateJWT` (router-level `router.use(validateJWT)`): `GET /`, `POST /items`, `PUT /items/:productId`, `DELETE /items/:productId`, `DELETE /` (clear).
- `/orders` — all require `validateJWT`: `POST /checkout` (`{ address }`), `GET /`, `GET /:id`.

### Cart & checkout behavior

- One `active` cart per user, created lazily by `findOrCreateActiveCart` in [backend/src/services/cartService.ts](backend/src/services/cartService.ts). Cart items snapshot `unitPrice`; `totalAmount` is recomputed on every mutation.
- `checkout` in [backend/src/services/orderService.ts](backend/src/services/orderService.ts): re-checks stock for every line, decrements product stock via `$inc`, creates an `Order` with a full item snapshot (`title`/`image`/`unitPrice`), marks the cart `completed`. Payment is mocked (`paymentStatus: "paid"`). **Not** wrapped in a Mongo transaction (would need a replica set) — acceptable for this project's scope.

Products are seeded once on startup via `seedInitialProducts()` in [backend/src/services/productService.ts](backend/src/services/productService.ts), which no-ops when the collection is non-empty.

## Frontend notes

- `frontend/src/lib/axios.ts` — one axios instance; a bearer-token interceptor attaches the JWT, and any `401` clears the token and bounces to `/login`. `VITE_API_URL` is read at build time and a trailing slash is trimmed.
- Auth endpoints return the **raw JWT string** as the response body (and plain-string errors); `frontend/src/lib/apiError.ts` normalises both that and the JSON `{ message }` shape used elsewhere.
- Cart items from the API are **not populated** — the cart page joins them against the products query.
- The catalog has no real cover art, so `frontend/src/components/ui/GeneratedSleeve.tsx` composes a stable typographic record sleeve per product (palette + catalog number derived from the id in `frontend/src/lib/vinyl.ts`).
- **i18n** (`frontend/src/i18n/`): a lightweight `I18nProvider` + `useI18n` with `en`/`ar` dictionaries in `dict.ts`. Every UI string goes through `t(key, vars?)`; the "Dead Wax" wordmark and record grades (NM, VG+) stay Latin. Arabic sets `dir="rtl"` and swaps type to Cairo; layouts use logical properties, and Latin tokens (grades, catalog nos, specs) are wrapped in `dir="ltr"` spans so bidi doesn't reorder them. `zodResolver` schemas that need translated messages are built inside the component with `useMemo`.
- **Theme** (`frontend/src/theme/`): `ThemeProvider` sets `data-theme` on `<html>`, defaults to the OS via `prefers-color-scheme`, toggle persists to `localStorage`. Dark mode redefines the `--color-*` tokens in `index.css`; `--color-paper` is a fixed light value for text on the always-dark spot/vinyl surfaces. `index.html` has an inline script that applies theme + direction before first paint.
- **Base path**: `vite.config.ts` uses `base: /E-Commerce_MERN/` for production builds only (dev stays `/`), overridable via `VITE_BASE`. The router takes `basename: import.meta.env.BASE_URL` so deep links resolve under that prefix.

## TypeScript config notes

`backend/tsconfig.json` runs `strict` plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` — indexed access yields `T | undefined` and optional properties cannot be assigned `undefined` explicitly. In Express 5, `req.params.x` is typed `string | string[]`; routes coerce with `String(...)` before passing to services.

`backend/tsconfig.json` sets `"ts-node": { "files": true }` so ambient declarations (notably [backend/src/types/express.d.ts](backend/src/types/express.d.ts)) are loaded — without it `ts-node` ignores `.d.ts` files that nothing imports and `req.user` fails to type-check at runtime even though `tsc` passes.
