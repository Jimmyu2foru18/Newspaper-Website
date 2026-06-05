# Part 3: Database & Authentication

This step links your project to a database and enables user logins.

### 1. Start the Database
Run this command in your terminal to start the PostgreSQL database:
```bash
docker run --name catalyst-db -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres
```

### 2. Configure Environment Variables
- Open the `.env` file in your project root.
- Ensure it contains:
  ```bash
  DATABASE_URL="postgresql://postgres:1234@localhost:5432/postgres"
  NEXTAUTH_SECRET="A_VERY_LONG_RANDOM_STRING_HERE"
  NEXTAUTH_URL="http://localhost:3000"
  ```

### 3. Sync Database & Seed Data
These commands map the database blueprint to your running Docker container and add the initial campus categories.
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

You are now ready to launch in [Part 4](part-4-launching.md).
