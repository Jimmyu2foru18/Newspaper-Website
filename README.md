# Old Westbury Catalyst: Setup & Deployment Handbook

## 1. Project Overview
The **Old Westbury Catalyst** is a professional-grade, mobile-first digital publishing ecosystem tailored for the SUNY Old Westbury community. It serves as a centralized hub for student journalism, multimedia storytelling, and academic research.

## 2. Local Environment Setup (New Computer)
Follow these instructions to set up the development environment from scratch.

### 2.1 Prerequisites
- **Node.js**: v20 or higher (`node -v`)
- **Docker Desktop**: Required to run the local PostgreSQL database.
- **Git**: For version control.

### 2.2 Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Catalyst
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```

### 2.3 Configuration (The `.env` File)
Create a `.env` file in the project root. This file contains sensitive credentials and must **never** be committed to Git.
```text
# Local PostgreSQL (running via Docker)
DATABASE_URL=postgresql://postgres:1234@localhost:5432/postgres?schema=public

# Security Secrets (Generate a random 32-char hex string)
NEXTAUTH_SECRET=5d88ab7113d66ea98bd24b115c5129fd9746bf2d72c902a22146a87358104693
NEXTAUTH_URL=http://localhost:3000
```

### 2.4 Database Initialization
1. **Start Docker Container**:
   ```bash
   docker run --name catalyst-db -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres
   ```
2. **Sync & Seed**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   node prisma/seed.js
   ```

### 2.5 Start Development
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

---

## 3. Deployment & Production Configuration
To move from local development to a live web environment, you must swap your local credentials for production-grade cloud services.

### 3.1 Production Prerequisites
- **Database (e.g., Neon.tech)**: Do not use local Docker in production. Create a cloud PostgreSQL instance.
- **Hosting (e.g., Vercel)**: Preferred for Next.js applications.

### 3.2 What to Change for Production
| Configuration | Local Development | Production Environment |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://.../localhost` | Cloud PostgreSQL Connection String |
| `NEXTAUTH_SECRET` | Static/Internal Secret | Unique, High-Entropy Secret |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://your-domain.vercel.app` |

**Crucial**: In Vercel, set these using the **Environment Variables** section of the dashboard. **Never add these to a `.env` file on your server.**

### 3.3 Deployment Checklist
- [ ] Push code to GitHub repository.
- [ ] Connect repository to Vercel/Hosting provider.
- [ ] Configure Environment Variables in the hosting dashboard.
- [ ] Run production migration: `npx prisma migrate deploy`.
- [ ] Build and Start: `npm run build` followed by `npm run start`.

---

## 4. Development & Workflow Guide
Once the platform is running:

### Content Management Workflow
1. **Staff Uploads**: Created content is marked `PENDING`.
2. **Faculty Review**: Faculty/Admins access `/admin/dashboard` to moderate content.
3. **Publication**: Faculty "Approve" moves content to `APPROVED` status, making it public.

### Role Verification
- **Admins/Faculty**: Access Editorial Dashboard for moderation/reporting.
- **Students**: Use `/profile` to submit content for faculty review.
- **Guests**: Browse and comment (tags comments as `Guest`).

### Testing & Maintenance
- **Prisma Studio**: If data becomes misaligned, run `npx prisma studio` to inspect or manually edit database tables.
- **Troubleshooting**: If you experience "Cannot read properties of undefined", verify your `.env` file is present and `npx prisma generate` has been executed.
