# PattayaPro - Complete Full-Stack Platform

## Project Structure
```
pattayapro/
├── backend/              # Express + Prisma API Server
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── utils/        # Helpers
│   │   └── index.js      # Server entry
│   ├── .env              # Environment variables
│   └── package.json
│
├── frontend/             # Next.js Customer Website + App
│   ├── src/
│   │   ├── pages/        # Next.js pages
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # Auth context
│   │   └── styles/       # Global styles
│   └── package.json
│
└── partner-app/          # Next.js Partner App
    ├── src/
    │   ├── pages/        # Partner pages
    │   ├── components/   # Partner components
    │   └── contexts/     # Partner auth
    └── package.json
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
# Server runs on http://localhost:5000
```

### 2. Customer Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3. Partner App
```bash
cd partner-app
npm install
npm run dev
# Runs on http://localhost:3001
```

## Database
- PostgreSQL (recommended) or SQLite for dev
- Update `DATABASE_URL` in `backend/.env`

## Default Test Accounts
- Customer: cherry@test.com / password123
- Partner: somchai@test.com / password123
- Admin: admin@pattayapro.com / admin123
