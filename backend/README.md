# SaaS Notes Backend

Multi-tenant SaaS Notes Application backend with JWT authentication, role-based access control, and subscription management.

## Architecture

**Multi-Tenancy Approach:** Shared schema with tenant isolation using `tenant_id` column
- **Why chosen:** Simplest to implement, maintain, and scale for this use case
- **Benefits:** Single database, easy backup/migration, cost-effective
- **Security:** Strict tenant isolation enforced at application level

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT tokens
- **Deployment:** Vercel
- **Validation:** Express-validator

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env` file:
```bash
cp .env.example .env
```

Update `.env` with your values:
```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
CORS_ORIGINS="http://localhost:3000"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed test data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/verify` - Verify JWT token

### Notes (Protected)
- `GET /notes` - List all notes for tenant
- `GET /notes/:id` - Get specific note
- `POST /notes` - Create new note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

### Tenants (Admin only)
- `POST /tenants/:slug/upgrade` - Upgrade to Pro plan
- `GET /tenants/:slug/info` - Get tenant information

### Health
- `GET /health` - Health check endpoint

## Test Accounts

All test accounts use password: `password`

- `admin@acme.test` - Admin at Acme (Free plan)
- `user@acme.test` - Member at Acme (Free plan)
- `admin@globex.test` - Admin at Globex (Free plan)
- `user@globex.test` - Member at Globex (Free plan)

## Features

### Multi-Tenancy
- Strict tenant isolation using `tenantId` in all data operations
- Shared database with tenant-specific data access
- URL-based tenant verification

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Member)
- Secure password hashing with bcryptjs

### Subscription Management
- Free Plan: Max 3 notes per tenant
- Pro Plan: Unlimited notes
- Real-time limit enforcement
- Admin-only upgrade capability

### Security
- Helmet for security headers
- Rate limiting (1000 requests/15min per IP)
- CORS configuration
- Input validation and sanitization
- SQL injection protection via Prisma

## Deployment to Vercel

### 1. Database Setup
Set up PostgreSQL database (recommended: Vercel Postgres, Railway, or PlanetScale)

### 2. Environment Variables
In Vercel dashboard, add:
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGINS`

### 3. Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. Run Migrations
After deployment, run database setup:
```bash
# Connect to your deployment
vercel env pull .env.production

# Run migrations on production DB
DATABASE_URL="your-prod-db-url" npx prisma migrate deploy
DATABASE_URL="your-prod-db-url" node prisma/seed.js
```

## Testing

The backend supports automated testing via the provided test accounts. All endpoints enforce:
- ✅ Tenant isolation
- ✅ Role-based permissions  
- ✅ Subscription limits
- ✅ JWT authentication
- ✅ Input validation

## Project Structure

```
├── server.js              # Main server file
├── vercel.json            # Vercel configuration
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js           # Test data seeding
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── notes.js          # Notes CRUD routes
│   ├── tenants.js        # Tenant management
│   └── health.js         # Health check
├── middleware/
│   └── auth.js           # Authentication middleware
└── README.md
```