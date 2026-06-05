# Guide 10: Engagement System

## Overview
Catalyst supports interactive engagement across Articles, Videos, Images, and Research Papers.

## Commenting
- **Authenticated Users**: Comments are linked to the user account, displaying their first and last name.
- **Anonymous Comments**: Users can select "Post anonymously". If unauthenticated, they are automatically treated as guests, assigned a generated guest identifier (e.g., "Guest 123"), and marked as `isGuest: true`.
- **Reporting**: Faculty, Admins, and Super Admins can report inappropriate comments via the `ShieldAlert` icon.

## Like System
- Authenticated users can toggle "Like" on any piece of multimedia content.
- The engagement count updates in real-time, reflecting total likes from the student body and faculty.

## Moderation
- Faculty and Admins can view reported comments in the "Reported Comments" section of the Editorial Dashboard.
- **Actions**:
    - **Delete Comment**: Permanently removes the comment from the database.
    - **Ignore**: Deletes only the report record, leaving the comment visible.
