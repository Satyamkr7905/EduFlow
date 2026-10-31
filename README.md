# EduFlow

A premium **EdTech CRM & Inquiry Management System**.

Parents, students and schools submit inquiries on a public website. Authenticated administrators manage those inquiries from a calm, modern dashboard — search, filter, update status, and watch live analytics.

This is a complete full-stack application: React + Vite on the frontend, Express + custom JWT auth on the backend, and **Supabase PostgreSQL** for persistence. Supabase Auth is **not** used.

---

## Features

**Public website**
- Landing page with hero, programs, about and contact
- Inquiry form with client + server validation
- Persists to PostgreSQL through the Express API (never localStorage)

**Admin CRM**
- Split-screen login with show/hide password and “remember me”
- JWT-protected dashboard, inquiries, analytics and settings
- Animated statistic cards, Recharts analytics, recent activity
- Search by name or phone, filters (category, user type, status, date)
- Server-side pagination
- Inquiry detail side panel, status updates, delete with confirmation
- Profile + password change

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS, React Router, Framer Motion, Lucide, Axios, Recharts |
| Backend | Node.js, Express, JWT (`jsonwebtoken`), bcryptjs, Zod, Helmet, CORS |
| Database | Supabase PostgreSQL (`pg` driver, connection string) |

---

## Project structure

```
eduflow-crm/
├── frontend/                 # Vite + React app
│   ├── src/
│   │   ├── components/       # UI, public, admin widgets
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/         # Axios API clients
│   │   ├── context/          # Auth + toasts
│   │   ├── utils/
│   │   └── assets/
│   └── vercel.json           # SPA rewrites for Vercel
├── backend/
│   ├── src/
│   │   ├── config/           # env + Postgres pool
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/       # JWT auth, validation, rate limits
│   │   ├── services/
│   │   ├── validators/       # Zod schemas
│   │   ├── app.js
│   │   └── server.js
│   └── scripts/              # db:init + seed:admin
├── database/
│   └── schema.sql
├── .env.example
└── README.md
```

---

## Prerequisites

- Node.js 18 or newer
- A [Supabase](https://supabase.com) project (free tier is enough)
- npm 9+

---

## 1. Clone and install

```bash
cd EdtechCRM
npm run install:all
```

Or install each side separately:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

---

## 2. Create the database

1. Open your Supabase project → **SQL Editor**.
2. Paste and run `database/schema.sql`.

Alternatively, after configuring `backend/.env`:

```bash
npm run db:init
```

This creates:

- `admins` — UUID pk, unique email, bcrypt `password_hash`
- `inquiries` — UUID pk, status default `New`, check constraints, indexes on `category`, `user_type`, `status`, `created_at`

Row Level Security is enabled (with no anon policies) so the auto-generated Supabase REST API cannot expose these tables. The Express server connects with the Postgres connection string and is the only client that reads/writes data.

---

## 3. Configure environment variables

### Backend — `backend/.env`

Copy from the root example:

```bash
# Windows (PowerShell)
Copy-Item .env.example backend/.env

# macOS / Linux
cp .env.example backend/.env
```

Then edit `backend/.env` and keep **only** the backend keys (or leave the frontend comments — they are ignored).

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | Supabase **Session pooler** or **Direct** URI |
| `DATABASE_SSL` | yes | `true` for Supabase |
| `JWT_SECRET` | yes | Long random string (32+ chars in production) |
| `JWT_EXPIRES_IN` | no | Default `1d` |
| `JWT_REMEMBER_EXPIRES_IN` | no | Default `30d` (used when “remember me” is checked) |
| `PORT` | no | Default `5000` |
| `CORS_ORIGINS` | yes | Comma-separated frontend origins |
| `SEED_ADMIN_*` | seed only | Used by `npm run seed:admin` |

Supabase connection string: **Project Settings → Database → Connection string → URI**.

Generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend — `frontend/.env`

```bash
VITE_API_URL=http://localhost:5000/api
```

See `frontend/.env.example`.

---

## 4. Create the first admin

Passwords are **never** hardcoded. Seed from environment variables or CLI flags:

```bash
cd backend
# uses SEED_ADMIN_NAME / EMAIL / PASSWORD from backend/.env
npm run seed:admin

# or pass flags (they override env)
node scripts/seedAdmin.js --name "Ada Admin" --email ada@eduflow.app --password "A-strong-pass-1"
```

The command is idempotent: if that email already exists it does nothing.

Default values in `.env.example` (`admin@eduflow.app` / `ChangeMe!2026`) are **local development placeholders**. Change them before any real deployment.

---

## 5. Run locally

From the repo root (API on `:5000`, web on `:5173`):

```bash
npm run dev
```

Or in two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

- Public site: http://localhost:5173
- Inquiry form: http://localhost:5173/inquire
- Admin login: http://localhost:5173/admin/login

---

## API reference

Base URL: `http://localhost:5000/api`

All successful responses:

```json
{ "success": true, "message": "…", "data": {}, "meta": {} }
```

All errors:

```json
{ "success": false, "message": "…", "errors": [{ "field": "email", "message": "…" }] }
```

Admin routes require:

```
Authorization: Bearer <jwt>
```

### Health

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | no | DB connectivity check |

### Authentication

| Method | Path | Auth | Body | Description |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | no | `{ email, password, rememberMe? }` | Returns `{ admin, token, expiresAt }` |
| GET | `/api/auth/me` | JWT | — | Current admin (no password hash) |
| PATCH | `/api/auth/me` | JWT | `{ name }` | Update display name |
| PATCH | `/api/auth/password` | JWT | `{ currentPassword, newPassword }` | Change password |

### Inquiries

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/inquiries` | no | Submit an inquiry |
| GET | `/api/inquiries` | JWT | List with search, filters, pagination |
| GET | `/api/inquiries/:id` | JWT | Single inquiry |
| PATCH | `/api/inquiries/:id/status` | JWT | `{ status }` → `New` \| `In Progress` \| `Resolved` |
| DELETE | `/api/inquiries/:id` | JWT | Permanent delete |

**POST /api/inquiries body**

```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "+91 98765 43210",
  "user_type": "Parent",
  "category": "Admission",
  "message": "We would like to know about Grade 6 admissions for 2026."
}
```

`user_type`: `Parent` | `Student` | `School`  
`category`: `Scholarship` | `Concert` | `Admission` | `General Query`

**GET /api/inquiries query parameters** (all optional, combinable)

| Param | Notes |
| --- | --- |
| `search` | Matches name (case-insensitive) **or** phone digits |
| `category` | Exact enum |
| `user_type` | Exact enum |
| `status` | Exact enum |
| `from` / `to` | `YYYY-MM-DD` |
| `page` | Default `1` |
| `limit` | Default `10`, max `100` |
| `sort` | `created_at` \| `updated_at` \| `name` \| `status` |
| `order` | `asc` \| `desc` |

### Dashboard

| Method | Path | Auth | Query | Description |
| --- | --- | --- | --- | --- |
| GET | `/api/dashboard/stats` | JWT | `range=7d\|30d\|90d\|all` | Totals, % change, sparklines, resolution rate |
| GET | `/api/dashboard/analytics` | JWT | `range=…` | Trend series, by category / user type / status, recent activity |

---

## Security

- Custom JWT auth (HS256). **Not** Supabase Auth.
- Passwords hashed with bcrypt (12 rounds). Hashes are never returned to the client.
- Timing-safe login (dummy hash compare when the email is unknown).
- Parameterized SQL only (`$1`, `$2`, …). Sort/order interpolated from a whitelist.
- Auth middleware on every admin route.
- Helmet, CORS allow-list, JSON body limit, rate limits on login + public inquiry + global API.
- JWT secret lives only on the server.

---

## Deployment

Deploy the **frontend** and **backend** as two services. The frontend talks to the backend via `VITE_API_URL`.

### Backend on Render

1. New **Web Service**, root directory `backend`.
2. Runtime: Node. Build: `npm install`. Start: `npm start`.
3. Environment variables (same as `backend/.env`):

   | Key | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `PORT` | leave default (Render sets this) |
   | `DATABASE_URL` | Supabase URI |
   | `DATABASE_SSL` | `true` |
   | `JWT_SECRET` | your production secret |
   | `CORS_ORIGINS` | `https://your-frontend.vercel.app` |

4. After the first deploy, open the Render shell and seed the admin:

   ```bash
   SEED_ADMIN_NAME="EduFlow Admin" \
   SEED_ADMIN_EMAIL="you@yourschool.edu" \
   SEED_ADMIN_PASSWORD="pick-a-strong-password" \
   npm run seed:admin
   ```

   (Or run the same command locally against the production `DATABASE_URL`.)

A `render.yaml` Blueprint is included at the repo root if you prefer infrastructure-as-code.

### Frontend on Vercel

1. New project, **Root Directory** = `frontend`.
2. Framework preset: Vite. Build: `npm run build`. Output: `dist`.
3. Environment variable:

   | Key | Value |
   | --- | --- |
   | `VITE_API_URL` | `https://your-backend.onrender.com/api` |

4. `frontend/vercel.json` already rewrites all routes to `index.html` so React Router works.

Redeploy the frontend after changing `VITE_API_URL` — Vite inlines it at build time.

### After both are live

1. Confirm `CORS_ORIGINS` on Render includes the exact Vercel origin (`https://….vercel.app`, no trailing slash).
2. Open the public site, submit a test inquiry.
3. Sign in at `/admin/login` and confirm it appears on the dashboard.

---

## Design

The UI follows the uploaded dashboard reference:

- Background `#F5F3ED`, cards white / beige / sage / coral / lavender / ink
- Headings: **Poppins** 500–700 · Body: **Inter** 400–600
- ~24px rounded cards, pill navigation, soft shadows
- Framer Motion page transitions, hover lift, animated counters

---

## Scripts

| Command | Where | What |
| --- | --- | --- |
| `npm run install:all` | root | Install root + backend + frontend |
| `npm run dev` | root | API + web together |
| `npm run build` | root / frontend | Production frontend build |
| `npm run db:init` | root / backend | Apply `database/schema.sql` |
| `npm run seed:admin` | root / backend | Create the first admin |
| `npm start` | backend | Production API |

---

## License

Private assessment project. Not licensed for redistribution.
