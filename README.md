# Old Westbury Catalyst: Platform Manual

## 1. Project Overview
The **Old Westbury Catalyst** is a professional-grade, mobile-first digital publishing ecosystem tailored for the SUNY Old Westbury community. It serves as a centralized hub for student journalism, multimedia storytelling, and academic research.

The platform implements a multi-tier editorial workflow to ensure content quality and community safety while empowering students, staff, and faculty to collaborate effectively.

## 2. Platform Architecture & Features
*   **Hierarchical RBAC System**: Secure permission management (Super Admin > Admin > Faculty > Staff > Student > Guest) governing content creation, approval, and user management.
*   **Multi-Tier Publication Workflow**: An automated editorial pipeline where staff submissions are held in `PENDING` status for faculty approval, ensuring quality control before public release.
*   **Multimedia Integration**: Support for diverse content formats including Articles, Videos, Research Papers, and Gallery Images, all managed through a unified publication interface.
*   **Engagement Suite**: Threaded comment system with anonymous posting capabilities, report-for-moderation functionality, and content liking.
*   **Audit Trail**: Automated tracking of authors and editors to maintain transparency in content evolution.

## 3. Local Development Guide
Follow these steps to set up a local development environment.

### 3.1 Prerequisites
- Node.js (v20+)
- PostgreSQL Database
- Git

### 3.2 Installation
1.  **Clone & Install**:
    ```bash
    git clone <repository-url>
    cd Catalyst
    npm install
    ```
2.  **Environment Setup**:
    Create a `.env` file in the root with:
    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/catalyst?schema=public"
    NEXTAUTH_SECRET="your-super-secret-random-string"
    NEXTAUTH_URL="http://localhost:3000"
    ```
3.  **Database Initialization**:
    Ensure your PostgreSQL instance is running.
    ```bash
    npx prisma migrate dev --name init
    node prisma/seed.js
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access the platform at `http://localhost:3000`.

## 4. Content Management & Workflow
Content is governed by the `ApprovalStatus` workflow:
1.  **Creation**: Users navigate to `/publish`.
2.  **Status Assignment**: 
    - Content by `Faculty`/`Admin` is automatically `APPROVED`.
    - Content by `Staff` is marked `PENDING` and routed to their assigned Faculty for review.
3.  **Moderation**: Faculty and Admins can approve or reject submissions via the **Moderation & Editorial Dashboard** (`/admin/dashboard`).

## 5. Web Hosting & Deployment
The platform is optimized for modern PaaS providers (e.g., Vercel, Railway).

### Deployment Steps:
1.  **Database**: Provision a managed PostgreSQL database (e.g., Neon, Supabase, or AWS RDS).
2.  **Environment Variables**: Inject `DATABASE_URL` and `NEXTAUTH_SECRET` into the host environment.
3.  **Build**: Ensure your pipeline runs `npm install && npx prisma generate && npm run build`.
4.  **Database Sync**: Run migrations in the production environment: `npx prisma migrate deploy`.
5.  **Start**: Ensure the production server runs `npm run start`.

## 6. Testing & Validation
- **Prisma Studio**: Use `npx prisma studio` to inspect the database, verify role assignments, or manually clear content reports.
- **Editorial Audit**: Always test the publishing workflow by creating a `Staff` account and verifying that its posts land in the Editorial Dashboard's pending queue.
- **Role Security**: Validate that the "Editorial" and "Admin" controls are hidden from `Student` and `Guest` users.

---
*Developed for the SUNY Old Westbury community.*
