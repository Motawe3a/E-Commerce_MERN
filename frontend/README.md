# Dead Wax — storefront frontend

React + TypeScript single-page app for the `backend/` REST API, themed as an
independent record shop. Members-only: the shop is behind a login.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **React Router 7** (`createBrowserRouter`)
- **TanStack Query** for all server state
- **Axios** instance with a bearer-token interceptor (`src/lib/axios.ts`)
- **Tailwind CSS v4** — design tokens in `src/index.css` (Anton + Archivo, ink on
  oat board, one vermilion spot). **lucide-react** icons.
- **react-hook-form** + **zod** for forms, **sonner** for toasts

## Running

```bash
npm install
npm run dev        # http://localhost:5173
```

The backend must be running (`cd ../backend && npm run dev`, needs MongoDB). Set the
API base URL in `.env`:

```
VITE_API_URL=http://localhost:3001
```

Other scripts: `npm run build` (`tsc -b && vite build`), `npm run preview`.

## Auth model

Only `/login` and `/register` are public (rendered in `AuthLayout`, no header).
Everything else sits under `RequireAuth` → `AppLayout`; an unauthenticated visit
redirects to `/login?next=…`. Signing out (and any `401`) clears the token and
navigates to `/login`.

## Structure

```
src/
  api/          typed endpoint functions (auth, products, cart, orders)
  auth/         AuthRoot (context inside the router), AuthProvider, RequireAuth, useAuth
  components/   ui/ (primitives + GeneratedSleeve), layout/, product/, cart/, order/
  hooks/        useProducts, useCart (+ mutations)
  lib/          axios, queryClient, apiError, jwt, currency, cn, vinyl
  pages/        one component per route
  types/api.ts  mirrors backend Mongoose documents
  router.tsx    route tree (AuthRoot → AuthLayout | RequireAuth → AppLayout)
```

## Notes on the backend contract

- `/users/login` and `/users/register` return the **raw JWT string** as the body;
  errors from those routes are plain strings. `src/lib/apiError.ts` normalises both
  that and the JSON `{ message }` shape used elsewhere.
- Cart items are **not populated** — `CartPage` joins them against the products
  query. Order items already carry a title/image/price snapshot.
- The catalog has no real cover art, so `GeneratedSleeve` composes a stable
  typographic sleeve per record (`src/lib/vinyl.ts` derives palette + a catalog
  number, format, and speed from the id). Real image URLs are used when present.
