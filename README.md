# SaaS Notes Application

A **Multi-tenant SaaS Notes App** with authentication, role-based access control, subscription management, and a modern responsive UI. Built using **Next.js (frontend)** and **Express.js + PostgreSQL (backend)**, this project demonstrates full-stack SaaS architecture with secure multi-tenancy.

### Live URLs -
- **Frontend** - [saas-notes-app-client.vercel.app](https://saas-notes-app-client.vercel.app)
- **Backend** - [saas-notes-app-server.vercel.app](https://saas-notes-app-server.vercel.app)

## Features

### Authentication & Authorization

* JWT-based authentication with secure password hashing
* Role-based access control (Admin / Member)
* Persistent login sessions

### Multi-Tenancy

* Tenant isolation with `tenant_id` at database level
* Shared schema (cost-efficient, scalable)
* Test tenants: **Acme** and **Globex**

### Subscription Management

* **Free Plan:** Max 3 notes per tenant
* **Pro Plan:** Unlimited notes
* Admins can upgrade tenant plans instantly

### Notes Management

* Full CRUD: create, read, update, delete notes
* Rich editor with title/content support
* Responsive grid layout & empty state handling

### Security

* Tenant isolation enforced at all layers
* Helmet for secure headers
* Rate limiting (1000 req / 15min / IP)
* Input validation & sanitization
* SQL injection protection via Prisma

---

## Tech Stack

**Frontend:**

* Next.js 15 (App Router)
* Tailwind CSS + custom components
* React Context API (state management)
* Axios (API client)
* Lucide React (icons)

**Backend:**

* Node.js + Express.js
* PostgreSQL + Prisma ORM
* JWT authentication
* Express-validator, Helmet, CORS

**Deployment:**

* Vercel (frontend & backend)

---


## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/adityasharmahub/saas-notes-app.git
cd saas-notes-app
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# configure DATABASE_URL, JWT_SECRET, etc.
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Backend runs at: **[http://localhost:3001](http://localhost:3001)**

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev
```

Frontend runs at: **[http://localhost:3000](http://localhost:3000)**

---

## Test Accounts

All accounts use password: **`password`**

| Email               | Role  | Tenant |
| ------------------- | ----- | ------ |
| `admin@acme.test`   | Admin | Acme   |
| `user@acme.test`    | User  | Acme   |
| `admin@globex.test` | Admin | Globex |
| `user@globex.test`  | User  | Globex |

---

## API Endpoints

### Auth

* `POST /auth/login` → Login
* `POST /auth/verify` → Verify JWT

### Notes (Protected)

* `GET /notes` → List notes
* `POST /notes` → Create note
* `PUT /notes/:id` → Update note
* `DELETE /notes/:id` → Delete note

### Tenant Management (Admin)

* `POST /tenants/:slug/upgrade` → Upgrade plan
* `GET /tenants/:slug/info` → Tenant details

### Health

* `GET /health` → `{ "status": "ok" }`

---

## Deployment

Both **frontend** and **backend** can be deployed on **Vercel**:

1. Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `NEXT_PUBLIC_API_URL`).
2. Deploy backend first, run migrations, seed data.
3. Deploy frontend with backend API URL configured.
4. Update backend CORS settings to allow frontend domain.

---

## Highlights

* ✅ Enterprise-grade multi-tenancy with tenant isolation
* ✅ Role-based access & subscription gating
* ✅ Responsive, modern UI with mobile support
* ✅ Production-ready security & deployment setup
* ✅ Fully documented with setup instructions

---

## Info

This project was built for an assignment submission.
