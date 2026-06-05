# Guide 08: Content Management System (CMS) and Approval Workflow

## Overview
The Catalyst CMS implements a multi-tier publication workflow to ensure content quality and editorial oversight.

## Approval Status
All content models (`Article`, `Video`, `ResearchPaper`, `Image`) utilize an `ApprovalStatus` enum:
- `PENDING`: Default for new content created by `STAFF`.
- `APPROVED`: Content visible to the public.
- `REJECTED`: Content flagged by Faculty and hidden from public view.

## Publication Pipeline
1.  **Submission**: Content is created via the `/publish` form.
    *   **Faculty/Admin**: Automatically set to `APPROVED`.
    *   **Staff**: Automatically set to `PENDING`.
2.  **Editorial Review**: Faculty members monitor the **Editorial Dashboard** (`/admin/dashboard`).
3.  **Action**: Faculty review `PENDING` submissions.
    *   **Approve**: Status transitions to `APPROVED`, content becomes public.
    *   **Reject**: Status transitions to `REJECTED`, content remains hidden (with optional feedback).

## Content Editing
- **Staff**: Can edit their own content regardless of status.
- **Faculty/Admin**: Can edit/delete *all* content on the platform.
- **History**: Edits record an `editorId` to maintain transparency.
