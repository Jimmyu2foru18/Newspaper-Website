# Guide 06: Authentication and Role-Based Access Control (RBAC)

## Overview
The Catalyst platform utilizes a hierarchical role-based access control system to manage user permissions and access.

## Numeric User IDs
All User IDs follow a mandatory numeric string format: `70xxxxxxx` (e.g., `700000001`). This format is generated sequentially upon registration using `getNextStudentId()` in `src/lib/utils.ts`.

## Role Hierarchy
Permissions are enforced using a strict hierarchy defined in `src/lib/permissions.ts`. Access levels are determined by the highest role held by a user:

| Role | Level | Capability |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | 5 | Full system control; Manage all users and content. |
| `ADMIN` | 4 | Manage all users/content; Approve/Reject moderation actions. |
| `FACULTY` | 3 | Manage assigned Staff/Students; Approve/Reject content; Upload content. |
| `STAFF` | 2 | Upload content (requires Faculty approval); Edit personal content. |
| `STUDENT` | 1 | Submit posts for Faculty review; Comment on content. |
| `GUEST` | 0 | Browse approved content; Comment as "Guest". |

## Authentication Flow
The system uses `next-auth` with a `PrismaAdapter`. Authentication persists user roles in the session token, which are subsequently checked by the `canManageContent`, `canApproveContent`, and `canManageUser` utility functions.
