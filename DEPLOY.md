# Deploying Dead Wax (100% free)

Three free services:

| Piece      | Host                | Free tier |
|------------|---------------------|-----------|
| Database   | MongoDB Atlas **M0**| 512 MB, free forever |
| Backend    | **Render** web service | 750 hrs/mo; sleeps after 15 min idle (~30–60s cold start) |
| Frontend   | **GitHub Pages**    | free for public repos; deployed by the included Actions workflow |

Total cost: **$0**. The only quirk is the backend cold-starting after inactivity.

Repo: `Motawe3a/E-Commerce_MERN` → site will live at
`https://motawe3a.github.io/E-Commerce_MERN/`.

---

## 1. Database — MongoDB Atlas

1. Sign up at <https://www.mongodb.com/cloud/atlas> and create a **free M0** cluster.
2. **Database Access** → *Add New Database User* → username + password, built-in role
   *Read and write to any database*.
3. **Network Access** → *Add IP Address* → **Allow access from anywhere** (`0.0.0.0/0`).
   Render's free instances don't have fixed IPs, so this is required.
4. **Connect** → *Drivers* → copy the connection string. Replace `<db_password>` and add
   the database name `ecommerce`:

   ```
   mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

## 2. Backend — Render

1. Sign up at <https://render.com> with GitHub.
2. **New +** → **Blueprint** → pick `E-Commerce_MERN`. Render reads [`render.yaml`](render.yaml).
3. It asks for two values:
   - `MONGO_URI` → the Atlas string from step 1.
   - `CLIENT_URL` → `https://motawe3a.github.io` **(origin only — no path, no trailing slash)**.

   `JWT_SECRET` is generated automatically.
4. **Apply**. First build + deploy takes ~2–3 min.
5. Copy the service URL, e.g. `https://dead-wax-api.onrender.com`. Open `<url>/products` —
   you should get a JSON array (three products seed themselves on first boot).

<details><summary>No Blueprint? Create it manually</summary>

**New +** → **Web Service** → connect the repo →
- Root Directory: `backend`
- Build Command: `npm ci`
- Start Command: `npm start`
- Instance Type: **Free**
- Environment variables: `MONGO_URI`, `CLIENT_URL` (as above), and `JWT_SECRET`
  (any long random string).
</details>

## 3. Frontend — GitHub Pages

1. Repo → **Settings → Pages** → *Build and deployment* → **Source: GitHub Actions**.
2. Repo → **Settings → Secrets and variables → Actions** → **Variables** tab →
   *New repository variable*:
   - Name: `VITE_API_URL`
   - Value: the Render URL from step 2 (e.g. `https://dead-wax-api.onrender.com`)
3. Repo → **Actions** → *Deploy frontend to GitHub Pages* → **Run workflow**
   (it also runs automatically on any push touching `frontend/`).
4. When it's green, the site is live at **`https://motawe3a.github.io/E-Commerce_MERN/`**.

## 4. First run

1. Open the **Render URL** once to wake the backend (free instances sleep).
2. Open the **Pages URL**, create an account, and browse.

## Updating

Push to `main`. The Pages workflow redeploys the frontend when `frontend/**` changes;
turn on auto-deploy in Render for the backend (`backend/**`).

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Blank page, 404s for `/assets/*.js` | `base` mismatch. The repo must be named `E-Commerce_MERN`, or edit `base` in `frontend/vite.config.ts` and re-run the workflow. For a custom domain set repo variable `VITE_BASE` to `/`. |
| Refreshing `…/products/abc` 404s | Handled: the build copies `index.html` → `404.html`, which GitHub serves for unknown paths; React Router (`basename`) then renders the route. If it regresses, confirm `dist/404.html` exists after `npm run build`. |
| Login fails with a network / CORS error | `CLIENT_URL` on Render must be exactly `https://motawe3a.github.io` — no path, no trailing slash. Update it and redeploy the backend. |
| First request very slow / 502 | Render cold start. Wait ~30–60s and retry. |
| Frontend calls `http://localhost:3001` | The `VITE_API_URL` repo **variable** wasn't set when the workflow ran. Set it, re-run the workflow. |

## Local development is unchanged

`base` only applies to production builds. `cd frontend && npm run dev` still serves from
`http://localhost:5173/`.
