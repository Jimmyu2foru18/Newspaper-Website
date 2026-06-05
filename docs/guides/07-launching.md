# Guide 07: Launching

## Pre-launch Checklist
1. **Migrations**: Ensure all local migrations have been applied to the production database: `npx prisma migrate deploy`.
2. **Environment Variables**: Configure all required environment variables in your production environment (DATABASE_URL, NEXTAUTH_SECRET, etc.).
3. **Seeding**: Ensure initial roles and admins are seeded.
4. **Build**: Run the production build: `npm run build`.

## Launch
Once built, start the production server:
```bash
npm run start
```
Ensure that media uploads are properly configured for the production environment (Catalyst supports local uploads; ensure persistent storage is available if not using an external S3 provider).
