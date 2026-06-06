# Old Westbury Catalyst: Setup & Deployment Handbook

## 1. Project Overview
The **Old Westbury Catalyst** is a professional-grade, mobile-first digital publishing ecosystem tailored for the SUNY Old Westbury community. It serves as a centralized hub for student journalism, multimedia storytelling, and academic research.

- admins/super admins should be able to edit and delete ant and all content added features to their role.
- faculty should be able to edit and delete any and all content as added feature to there role. 
- faculty can upload content.

- staff can upload content. and edit personal content.
- staff needs faculty aproval to publish content.
- faculty can aprove content to be published.
- faculty can assign staff to their monotoring.
- faculty can remove staff from their monotoring.
- students can comment on posted content.
- students can submit to faculty content to be posted on behalf of the student.
- guest can comment only.
- any user not logged in is assigned comment value as a guest.
- comment will state the post was posted under guest.


 Summary of Proposed Strategy:
   * Hierarchical Category System: Implementing a nested category structure to support specific sections like Sports >
     Basketball and Student Life > Clubs.
   * Multimedia Hub: Creating a unified multimedia.php page that serves as a central destination for both Video and
     Podcast content.
   * Interactive Archive Gallery: Developing a visually engaging gallery for historical print editions, allowing for
     decade/year browsing.
   * Homepage Redesign: Introducing a "Featured Story" hero area, followed by reverse-chronological feeds and category
     highlights to maximize content discovery.
   * Reader Engagement: Adding a polling system and social media integration to increase student interaction.

  ---

OW Catalyst Digital Newspaper Transformation

  This plan outlines the steps to transform the current OW Catalyst site into a full-featured digital newspaper platform
  for SUNY Old Westbury.

  1. Database Schema Enhancements
  We need to evolve the data model to support hierarchical categorization, featured content, and the new functional
  modules.

  Proposed SQL Changes:
   - categories Table:
     - id (INT, PK, AUTO_INCREMENT)
     - name (VARCHAR)
     - slug (VARCHAR, UNIQUE)
     - parent_id (INT, NULL, FK to categories.id) - To support Student Life > Clubs, Sports > Basketball, etc.
   - content Table Updates:
     - category_id (INT, FK to categories.id)
     - is_featured (BOOLEAN, DEFAULT FALSE)
     - featured_image (VARCHAR) - URL or path for the lead image.
     - excerpt (TEXT) - For previews on homepage/archives.
     - video_url (VARCHAR) - Specifically for multimedia types.
   - polls System:
     - polls table: id, question, is_active, created_at.
     - poll_options table: id, poll_id, option_text.
     - poll_votes table: id, option_id, user_identifier (IP/Session).
   - users Table Updates:
  2. Global Navigation & Branding
  Refactor includes/Header.php and includes/Footer.php to match the required architecture.

   - Primary Nav: Home, News, Student Life (Dropdown), Sports (Dropdown), Videos, Podcasts, Opinion, About (Dropdown).
   - Search: Add a global search bar in the header.
   - Social Links: Add persistent social media icons in header/footer.

  3. Homepage Reconstruction (index.php)
  Rebuild the landing page to prioritize content discovery.

   - Featured Story Area: A large block at the top for the latest is_featured article.
   - Latest Stories Feed: A reverse-chronological list of all approved content.
   - Category Highlight Sections: Horizontal bands or grids showing the 3 most recent items from News,

Student Life,
     Sports, etc.
   - Polling Sidebar/Widget: Interactive reader engagement.
   - Social Media Integration: Promo block for Instagram/X/TikTok.

  4. Dedicated Section Pages
  Create new PHP files or a routing mechanism for specific sections:

   - news.php: General news archive.
   - student-life.php: Clubs, Events, Community stories.
   - sports.php: Team-specific reporting.
   - multimedia.php: A unified hub for video and audio journalism (Podcasts).
   - about.php: Staff directory and historical information.
   - archive.php: An interactive gallery for historical print editions.

  5. Article Experience (news.php?id=X)
  Enhance the individual article view:

   - Header: Large headline, author attribution with bio link, date, category.
   - Body: Support for inline images and rich text (via nl2br or HTML).
   - Social Sharing: Links to Email, Print, and Copy Link.
   - Discovery: "Related Stories" section at the bottom based on category.

  6. Staff Directory & Author Archives
   - staff.php: Grid of all STAFF, FACULTY, and ADMIN users.
   - author.php?id=X: List of all articles written by a specific user.

  7. Historical Archive
   - archive.php: An interactive gallery of historical print editions, allowing users to browse by decade/year and
     view/download legacy reporting.

  8. Styling & Mobile Optimization (assets/style.css)
   - Update typography for readability (Serif for article bodies?).
   - Improve grid layouts for better multi-content presentation.
   - Ensure the navigation is touch-friendly and the layout is fully responsive.

  Implementation Phases

 Foundation (DB & Navigation)
   1. Run SQL migrations (Hierarchical Categories, Polls, Content Updates).
   2. Update sql/seed.sql with the full category tree and sample data.
   3. Rewrite includes/Header.php with the new navigation structure (including dropdowns).

  Core Frontend (Homepage & Articles)
   1. Redesign index.php with Hero area and Latest feed.
   2. Update news.php for better layout and sharing features.
   3. Implement search.php.

Specialized Hubs
   1. Create student-life.php, sports.php, opinion.php.
   2. Build multimedia.php (Unified Hub).
   3. Build about.php and staff.php.

 Archives & Engagement
   1. Build the Polling system.
   2. Build the archive.php (Interactive Gallery).
   3. Final styling polish.

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
