# Guide 05: Database Authentication

## User Registration
- Registrations are processed via `/api/register`.
- **Constraint**: Users must have a unique email.
- **Workflow**: Upon registration, new users are automatically assigned the `STUDENT` role.
- **ID Generation**: The system uses `getNextStudentId()` to generate a unique `70xxxxxxx` ID for new students.

## Profile Management
- Users can update their profile bio/avatar via `/api/profile/update`.
- Password changes are gated by current password verification using `bcrypt`.
