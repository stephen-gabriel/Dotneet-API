# Dotneet API

Production-ready backend API service for **Dotneet**, built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL (Neon).

---

## 🚀 Architecture & Tech Stack

- **Runtime:** Node.js (v22+)
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM & Database:** Prisma ORM with PostgreSQL (Neon)
- **Security:** Helmet, CORS, Express Rate Limit
- **Validation:** Zod
- **Hosting / Deployment:** Render (via `render.yaml`)

---

## 📂 Project Structure

```text
├── prisma/
│   ├── legacy-schema.prisma          # Legacy database schema backup
│   ├── schema.prisma                 # Primary Prisma schema & data models
│   └── migrations/                   # Database migration history
├── src/
│   ├── config/
│   │   └── index.ts                  # Environment configuration & validation
│   ├── middleware/
│   │   ├── cors.ts                   # CORS configuration & allowed origins
│   │   ├── errorHandler.ts           # Centralized Express error handler
│   │   └── rateLimiter.ts            # Rate limiting middleware
│   ├── routes/
│   │   ├── health.ts                 # Health check & liveness endpoint
│   │   └── profiles.ts               # Profile discovery, search & CRUD endpoints
│   ├── services/
│   │   └── profileService.ts         # Business logic for profile search & operations
│   ├── utils/
│   │   ├── logger.ts                 # Structured logging utility
│   │   ├── prisma.ts                 # Prisma Client singleton instance
│   │   └── validation.ts             # Zod input validation schemas
│   ├── app.ts                        # Express application setup & middleware wiring
│   └── server.ts                     # HTTP server entry point
├── .env.example                      # Environment variables template
├── .eslintrc.cjs                     # ESLint configuration
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies and npm scripts
├── render.yaml                       # Render.com deployment blueprint
└── tsconfig.json                     # TypeScript configuration
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js `v22.x` or higher
- npm `v10.x` or higher
- PostgreSQL database (or Neon account)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/stephen-gabriel/Dotneet-API.git
cd Dotneet-API
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your PostgreSQL connection string:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/dotneet_dev?sslmode=require"
ALLOWED_ORIGINS="http://localhost:3000,https://dotneet.vercel.app"
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### 3. Setup Database & Prisma
Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:4000`.

---

## 📡 API Endpoints

### Health Check
- **GET `/health`**
  - Returns service health status, timestamp, and environment.

### Profiles
- **GET `/api/profiles`**
  - Search and discover profiles with query parameters (`search`, `page`, `limit`).
- **GET `/api/profiles/:id`**
  - Retrieve detailed profile information by ID.

---

## 🚢 Deployment on Render

This repository includes a `render.yaml` configuration file for seamless deployment on [Render](https://render.com).

### Deployment Steps:
1. Push your repository to GitHub (`main` branch).
2. On Render Dashboard, click **New +** -> **Blueprint**.
3. Connect your repository (`stephen-gabriel/Dotneet-API`).
4. Render will automatically detect `render.yaml`, configure the web service, build the project, run database migrations (`prisma migrate deploy`), and start the API.
5. Set your secret environment variables (such as `DATABASE_URL`) securely in the Render Dashboard under **Environment**.

---

## 🧪 Scripts & Quality Checks

- `npm run dev` - Start development server with hot reload (`tsx watch`)
- `npm run build` - Compile TypeScript to JavaScript (`tsc`)
- `npm start` - Start production server (`node dist/server.js`)
- `npm run lint` - Run ESLint checks
- `npm run typecheck` - Validate TypeScript types without emitting code
