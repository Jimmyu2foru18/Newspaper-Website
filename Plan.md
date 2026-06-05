# Old Westbury Catalyst

## Project Overview

**Old Westbury Catalyst** is a mobile-first, full-stack digital publishing and media platform designed for student journalism, news reporting, academic publishing, and community engagement.

The platform serves as a centralized hub where Catalyst members, student journalists, editors, contributors, and public users can publish, manage, and interact with multimedia content including articles, news stories, videos, journals, research papers, editorials, opinion pieces, and community posts.

Built with **TypeScript**, **Node.js**, and modern web technologies, the system provides scalable content management, user authentication, moderation tools, and long-term storage for all published materials.

---

## Core Goals

* Create a modern digital newsroom platform.
* Support student journalism and media publication.
* Archive articles, videos, journals, and research papers.
* Allow public engagement through comments and discussions.
* Provide role-based content management.
* Maintain searchable historical records of all content.
* Deliver a responsive mobile-first user experience.

---

## User Roles

### Guest Users

Guests can:

* Browse public content.
* Read articles and journals.
* Watch published videos.
* Search archives.
* Leave comments using:

  * Randomized guest username generation.
  * Anonymous posting option.
* Report inappropriate content.

### Registered Student Users

Registered users can:

* Create accounts.
* Customize profiles.
* Save bookmarks.
* Follow categories and topics.
* Comment on content.
* Submit community posts.
* Upload media within permissions.
* Receive notifications.

### Catalyst Members

Catalyst Members can:

* Publish articles.
* Publish journals.
* Upload videos.
* Create news reports.
* Manage drafts.
* Edit their own content.
* View publishing analytics.
* Collaborate with other members.

### Editors

Editors can:

* Review submissions.
* Approve content.
* Reject content.
* Schedule publications.
* Manage categories.
* Moderate comments.
* Feature content on the homepage.

### Administrators

Administrators can:

* Manage users.
* Assign roles.
* Manage permissions.
* Moderate platform activity.
* Configure system settings.
* Manage themes.
* View platform analytics.
* Access audit logs.
* Manage storage and backups.

---

## Content Types

### News Articles

* Rich text editor
* Draft system
* Scheduled publishing
* Featured images
* Categories
* Tags

### Videos

* Video uploads
* Embedded video support
* Video libraries
* Playlists
* Video categories

### Journals

* Academic publications
* Research content
* Long-form writing
* Citation support

### Research Papers

* PDF uploads
* Metadata storage
* Author information
* Download tracking

### Community Posts

* Student discussions
* Announcements
* Club updates
* Event posts

### Static Pages

* About Us
* Staff Directory
* Contact
* Policies
* Advertisements
* Special Projects

---

## Mobile-First Design

### Design Principles

* Mobile-first layout
* Responsive design
* Fast loading
* Accessible interfaces
* Touch-friendly navigation

### Navigation

Bottom mobile navigation:

* Home
* News
* Videos
* Search
* Profile

Desktop navigation:

* Home
* News
* Videos
* Journals
* Papers
* Community
* Archive
* About

---

## Content Management System

### Editor Features

* Rich text HTML editor
* Markdown support
* Auto-save drafts
* Revision history
* Media embedding
* SEO metadata
* Publishing workflow

### Storage

Store:

* HTML article content
* Markdown content
* Uploaded videos
* Images
* PDFs
* User-generated posts
* Comment history

---

## Search System

Search across:

* Articles
* Videos
* Journals
* Research papers
* Posts
* Authors
* Tags
* Categories

Advanced filters:

* Date
* Author
* Category
* Content type

---

## Comment System

### Features

* Threaded replies
* Guest commenting
* Anonymous commenting
* Moderation queue
* Spam protection
* User reporting

Guest identities:

* Random generated usernames
* Example:

  * CatalystFox734
  * OwlReporter291
  * CampusVoice104

This provides accountability while protecting guest privacy.

---

## Theme System

Administrators can create and manage:

* News themes
* Event themes
* Seasonal themes
* School branding themes

Theme capabilities:

* Custom colors
* Typography
* Layout templates
* Homepage configurations

---

## Recommended Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Shadcn/UI

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL

### ORM

* Prisma

### Authentication

* JWT
* Secure Sessions
* Role-Based Access Control

### Storage

* Local storage for InfinityFree deployment
* Cloudflare R2 (future upgrade)
* S3-compatible storage support

### Search

* PostgreSQL Full-Text Search

---

## Database Modules

### Users

* Accounts
* Roles
* Profiles
* Permissions

### Content

* Articles
* Videos
* Journals
* Papers
* Posts

### Media

* Uploads
* Metadata
* Storage references

### Comments

* Threads
* Moderation
* Reports

### Analytics

* Views
* Engagement
* Publishing statistics

### Audit Logs

* User actions
* Content changes
* Administrative activity

---

## Future Enhancements

* Podcast publishing
* Live streaming
* Push notifications
* Newsletter system
* AI-assisted article tagging
* Campus event calendar
* Faculty contributor accounts
* Mobile application
* API for external integrations

---

## Mission Statement

Old Westbury Catalyst empowers students, journalists, researchers, and community members by providing a modern digital publishing platform for news, media, academic work, and public discussion. Through accessible technology, secure content management, and community engagement, the platform preserves and promotes the voices and stories of the Old Westbury community.
