# Guide 01: Environment Setup

## Prerequisites
- Node.js (v20+)
- PostgreSQL Database
- Git

## Environment Variables
Create a `.env` file in the root directory:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/catalyst?schema=public"
NEXTAUTH_SECRET="your-super-secret-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

## Setup Instructions
1. Install dependencies: `npm install`
2. Initialize database: `npx prisma db push`
3. Seed roles and initial users: `node prisma/seed.js`
4. Start development server: `npm run dev`
