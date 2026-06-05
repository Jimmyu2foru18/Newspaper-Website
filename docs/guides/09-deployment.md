# Guide 09: Deployment

## Production Environment
- **Node.js**: Ensure the production environment uses the same Node version as development (v20+).
- **Database**: Use a managed PostgreSQL instance for production stability.
- **Environment**: Set `NODE_ENV=production`.

## Deployment Steps
1. Push code to your deployment target (e.g., Vercel, Railway, or VPS).
2. Configure environment variables in the deployment dashboard.
3. Trigger a database migration: `npx prisma migrate deploy`.
4. Run the build command as part of your CI/CD pipeline: `npm run build`.
