# Guide 03: Platform Initialization

## Seeding
To initialize roles and core users, use the provided seed script:
```bash
node prisma/seed.js
```
*Note*: The seed script ensures that the `Role` table is populated correctly, which is required for user registration and role-based access control.

## Initial Database Sync
After changing the schema, always synchronize your local database:
```bash
npx prisma migrate dev --name <migration-name>
```
This applies the migration SQL files and updates the Prisma Client.
