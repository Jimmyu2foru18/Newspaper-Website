# Guide 02: Platform Foundation

## Overview
Catalyst is built as a mobile-first publishing and community platform.

## Key Technologies
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Media**: Integrated file upload for Images, PDFs, and thumbnails.

## Database Schema
The database uses normalized relational modeling. Primary keys for `User` are numeric strings (`70xxxxxxx`). Content models (`Article`, `Video`, etc.) are related to `User` via `authorId` and `editorId` for auditing.
