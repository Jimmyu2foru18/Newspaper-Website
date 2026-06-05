# Old Westbury Catalyst: Project Documentation & Build Manual

## 1. Project Overview
The **Old Westbury Catalyst** is a comprehensive, mobile-first digital publishing ecosystem tailored for the SUNY Old Westbury community. Designed to serve as the premier hub for investigative student journalism, multimedia content, and academic scholarly inquiry, this platform democratizes access to information and fosters community engagement.

By integrating robust content management with an interactive discussion layer, the Catalyst provides a structured, secure, and professional space for students, faculty, and staff to amplify their voices, showcase research, and participate in campus dialogue.

## 2. Architectural Philosophy
This project was engineered with three core principles:
*   **Accessibility:** A mobile-first, responsive design ensures the platform is equally powerful on handheld devices and desktop workstations.
*   **Integrity:** Role-Based Access Control (RBAC) ensures content moderation and administrative oversight remain reliable and accountable.
*   **Extensibility:** By utilizing a modular, component-driven architecture (Next.js/React), new content types (e.g., podcasts, interactive maps) can be integrated without rebuilding the foundation.

## 3. Technical Stack Specifications
The platform leverages a modern, enterprise-grade stack:
- **Framework:** Next.js (App Router, React 19)
- **Language:** TypeScript (for type safety and maintainability)
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** NextAuth.js (supporting secure, credential-based sign-in)
- **Styling:** Tailwind CSS (Custom thematic implementation)
- **CMS Editor:** Tiptap (Rich text, Markdown-compliant editing)
- **Deployment:** Vercel (for high-availability, globally distributed hosting)

## 4. Key Platform Features
*   **Integrated Multi-Format CMS:** A unified dashboard allows authors to seamlessly publish long-form articles, link external multimedia content (videos/documentaries), or upload academic research papers with abstracts.
*   **Community Engagement Engine:** A polymorphic threaded comment system that works across all content modules, enhanced by a randomized "Guest Identity Generator" (e.g., `CatalystPanther412`) to ensure private yet accountable campus interaction.
*   **Granular RBAC System:** A robust permissions matrix restricts content creation to Staff and Faculty, while empowering Students to contribute through moderated discussions.
*   **Global Discovery Engine:** A real-time, asynchronous search API that indexes metadata, content bodies, and categories across all media types simultaneously.
*   **Thematic Identity:** A fully cohesive visual identity utilizing the SUNY Old Westbury brand color palette (`#004C33`) and featuring the school mascot, Owen the Panther, as a thematic element.

## 5. Masterclass: Build & Learning Roadmap
For those looking to understand or extend this codebase, we provide a comprehensive, zero-knowledge educational manual:

| Part | Title | Focus |
| :--- | :--- | :--- |
| **1** | [Setting Up Your Workbench](docs/guides/part-1-setup.md) | Essential environment setup (Node, Docker, VS Code). |
| **2** | [Project Anatomy](docs/guides/part-2-foundation.md) | Understanding Next.js structure and Tailwind. |
| **3** | [Database & Schema](docs/guides/part-3-db.md) | Database modeling with Prisma and PostgreSQL. |
| **4** | [Auth & UI Layout](docs/guides/part-4-auth.md) | Security implementation and site-wide components. |
| **5** | [CMS Implementation](docs/guides/part-5-cms.md) | Rich text editor logic and content forms. |
| **6** | [Engagement & Search](docs/guides/part-6-engagement.md) | Discussion threading and search algorithms. |
| **7** | [Deployment](docs/guides/part-7-deployment.md) | Cloud hosting and production environment setup. |

---

## 6. Local Development Guide
To launch this project on your machine, follow these steps exactly. Ensure **Docker Desktop** is installed and running before you begin.

### Step 1: Install Dependencies
Open your terminal in the project root:
```bash
npm install --legacy-peer-deps
```

### Step 2: Initialize Database
Start the containerized PostgreSQL database:
```bash
docker run --name catalyst-db -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres
```

### Step 3: Configure Environment
Create a `.env` file in the root with the following variables:
```bash
DATABASE_URL="postgresql://postgres:1234@localhost:5432/postgres"
NEXTAUTH_SECRET="A_VERY_LONG_RANDOM_STRING_HERE"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Sync & Seed
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Step 5: Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to access the platform.

## 7. Database Management
To extend the application:
1. **Schema:** Modify `prisma/schema.prisma` to define new models.
2. **Apply:** Run `npx prisma db push` to synchronize changes with your database.
3. **Seed:** If adding mandatory data, update `prisma/seed.js` and run `npx prisma db seed`.

## 8. Contribution Guidelines
1. **Fork** the repository.
2. **Feature Branch:** Create a branch for your work: `git checkout -b feature/your-feature-name`.
3. **Commits:** Maintain clear, concise commit messages.
4. **Pull Request:** Open a pull request against the `main` branch.

## 9. Credits & Acknowledgments
The **Old Westbury Catalyst** is a community-driven project dedicated to amplifying student voices and maintaining academic rigor at SUNY Old Westbury.
*Project Mascot: Owen the Panther.*

---
*Developed with ❤️ for the SUNY Old Westbury community.*
