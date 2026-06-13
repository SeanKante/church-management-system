# ChurchOS — Church Management System

A modular church management system with separate backend APIs per module, a modern
minimal dashboard UI, and role-based access control (RBAC).

> **Status: Phase 1 (Foundation).** Auth + RBAC, dashboard shell, dashboard home,
> and a members directory are live. Remaining modules are scaffolded as
> permission-gated placeholder pages and will be built in later phases.

## Tech Stack

| Layer    | Choice                                                        |
| -------- | ------------------------------------------------------------ |
| Monorepo | pnpm workspaces (`apps/api`, `apps/web`, `packages/shared`)  |
| Backend  | NestJS (Node + TypeScript) — one module per domain          |
| Database | PostgreSQL + Prisma ORM                                      |
| Auth     | JWT (access token) + bcrypt                                  |
| RBAC     | Role → permission mapping, enforced by a Nest guard         |
| Frontend | React + Vite + TypeScript + Tailwind CSS                     |
| Data     | TanStack Query + Axios                                       |

## Repository Layout

```
church-management-system/
├── apps/
│   ├── api/        # NestJS backend
│   │   ├── prisma/ # schema, migrations, seed
│   │   └── src/
│   │       ├── auth/        # login/register, JWT, RBAC guards + decorators
│   │       ├── dashboard/   # overview cards + activity feed
│   │       ├── members/     # members directory API (RBAC-protected)
│   │       └── prisma/      # PrismaService
│   └── web/        # React dashboard (app shell, pages)
├── packages/
│   └── shared/     # Role/Permission enums + shared types (used by both apps)
├── docker-compose.yml  # local Postgres
└── render.yaml         # Render deployment blueprint
```

## Roles & Permissions

Four roles, each mapped to a permission set in `packages/shared/src/rbac.ts`:

- **ADMIN** — full access (all permissions, incl. user management)
- **PASTOR** — members, structure, events, attendance, communication, pastoral care, content, analytics
- **LEADER** — view members/structure, manage events & attendance, pastoral view, content view
- **MEMBER** — view events & content

The backend enforces permissions via `@RequirePermissions(...)` + `PermissionsGuard`.
The frontend hides nav items and guards routes the user lacks permission for.

## Local Development

### Prerequisites

- Node.js >= 20
- pnpm 9 (`corepack enable`)
- Docker (for local Postgres) — or any reachable PostgreSQL

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start Postgres
pnpm db:up                 # docker compose up -d

# 3. Configure the API env
cp apps/api/.env.example apps/api/.env

# 4. Build shared types, generate Prisma client, run migrations, seed demo data
pnpm --filter @cms/shared build
pnpm --filter @cms/api exec prisma generate
pnpm --filter @cms/api exec prisma migrate deploy
pnpm --filter @cms/api exec tsx prisma/seed.ts

# 5. Run both apps (API on :4000, web on :5173)
pnpm dev
```

Open http://localhost:5173 and sign in with a demo account.

### Demo Accounts

Password for all: **`Password123`**

| Role   | Email              |
| ------ | ------------------ |
| Admin  | admin@church.org   |
| Pastor | pastor@church.org  |
| Leader | leader@church.org  |
| Member | member@church.org  |

## Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `pnpm dev`         | Run API + web together                   |
| `pnpm build`       | Build shared, then both apps             |
| `pnpm lint`        | Lint all packages                        |
| `pnpm typecheck`   | Typecheck all packages                   |
| `pnpm db:up`       | Start local Postgres (Docker)            |
| `pnpm api:dev`     | Run only the API                         |
| `pnpm web:dev`     | Run only the web app                     |

## API Overview

All routes are prefixed with `/api`. Auth uses a Bearer token from `/api/auth/login`.

| Method | Route                     | Auth         | Description                  |
| ------ | ------------------------- | ------------ | ---------------------------- |
| POST   | `/api/auth/register`      | public       | Create a Member account      |
| POST   | `/api/auth/login`         | public       | Log in, returns JWT          |
| GET    | `/api/auth/me`            | any user     | Current user + permissions   |
| GET    | `/api/dashboard/overview` | any user     | Overview card metrics        |
| GET    | `/api/dashboard/activity` | any user     | Recent activity feed         |
| GET    | `/api/members`            | members:view | Member directory (+ search)  |

## Deployment (Render)

This repo includes a `render.yaml` Blueprint that provisions three resources:
a PostgreSQL database, the NestJS API (web service), and the React frontend
(static site).

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, point it at this repo. Render reads `render.yaml`.
3. Render auto-provisions Postgres and wires `DATABASE_URL` into the API; it also
   generates `JWT_SECRET`.
4. Set the two cross-service URL vars (they can't be auto-derived):
   - On **cms-api**: `CORS_ORIGIN` = your web URL, e.g. `https://cms-web.onrender.com`
   - On **cms-web**: `VITE_API_URL` = your API URL + `/api`, e.g. `https://cms-api.onrender.com/api`
   - Redeploy **cms-web** after setting `VITE_API_URL` (it's baked in at build time).
5. The API runs `prisma migrate deploy` on start. To load demo data once, run
   `pnpm --filter @cms/api exec tsx prisma/seed.ts` from a Render shell (optional).

> Note: Render's free tier sleeps idle web services, so the first request after
> idle may take ~30s to wake. The free Postgres instance expires after 90 days.

## Roadmap

- **Phase 1 (done):** Auth, RBAC, app shell, dashboard home, members directory, seed.
- **Phase 2:** Members CRUD + profiles, Church Structure, Events, Attendance.
- **Phase 3:** Communication, Pastoral Care, Content/Sermons.
- **Phase 4:** Analytics, full User/Role management, Children/Youth check-in.
