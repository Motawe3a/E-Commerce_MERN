# Storefront frontend

React + TypeScript single-page app for the `backend/` REST API. Customer flow only:
auth, catalog, per-user cart, checkout, and order history.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **React Router 7** (`createBrowserRouter`)
- **TanStack Query** for all server state
- **Axios** instance with a bearer-token interceptor (`src/lib/axios.ts`)
- **Tailwind CSS v4** (design tokens in `src/index.css`), **lucide-react** icons
- **react-hook-form** + **zod** for forms, **sonner** for toasts

## Running

```bash
npm install
npm run dev        # http://localhost:5173
```

The backend must be running (`cd ../backend && npm run dev`, needs MongoDB). Configure the
API base URL in `.env`:

```
VITE_API_URL=http://localhost:3001
```

Other scripts: `npm run build` (`tsc -b && vite build`), `npm run preview`.

## Structure

```
src/
  api/          typed endpoint functions (auth, products, cart, orders)
  auth/         AuthProvider, useAuth, ProtectedRoute — JWT kept in localStorage
  components/   ui/ (primitives), layout/, product/, cart/, order/
  hooks/        useProducts, useCart (+ mutations)
  lib/          axios, queryClient, apiError, jwt, currency, cn
  pages/        one component per route
  types/api.ts  mirrors backend Mongoose documents
  router.tsx    route tree
```

## Notes on the backend contract

- `/users/login` and `/users/register` return the **raw JWT string** as the body; errors
  from those routes are also plain strings. `src/lib/apiError.ts` normalises both that and
  the JSON `{ message }` shape used elsewhere.
- Cart items are **not populated** — `CartPage` joins them against the products query for
  title/image. Order items already carry a title/image/price snapshot.
- Any `401` clears the token and redirects to `/login`.
- The cart requires auth, so "Add to cart" while logged out routes to `/login?next=…`.
- Seeded product images point at a dead host; `ProductImage` falls back to an inline SVG.
