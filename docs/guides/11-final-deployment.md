# Guide 11: Final Deployment Checklist

## Post-Deployment Validation
- [ ] Verify database connection.
- [ ] Test user login and role persistence.
- [ ] Verify content publication (Staff -> Pending -> Approved by Faculty).
- [ ] Test file uploads (PDF, Images).
- [ ] Confirm Editorial Dashboard (Moderation, Reports, Monitoring) is functional for Faculty.
- [ ] Check search functionality and search results visibility.

## Support & Maintenance
Monitor server logs for Prisma errors (`PrismaClientKnownRequestError`). If IDs or roles appear misaligned, use `prisma studio` or the provided CLI diagnostic scripts to verify data integrity.
