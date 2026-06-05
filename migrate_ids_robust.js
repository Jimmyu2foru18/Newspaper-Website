const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting Robust User ID Migration...");

  // The names of the foreign key constraints from the migration diff
  const constraints = [
    { table: '"UserRole"', name: '"UserRole_userId_fkey"' },
    { table: '"Profile"', name: '"Profile_userId_fkey"' },
    { table: '"Account"', name: '"Account_userId_fkey"' },
    { table: '"Session"', name: '"Session_userId_fkey"' },
    { table: '"Article"', name: '"Article_authorId_fkey"' },
    { table: '"Video"', name: '"Video_authorId_fkey"' },
    { table: '"ResearchPaper"', name: '"ResearchPaper_authorId_fkey"' },
    { table: '"Image"', name: '"Image_authorId_fkey"' },
    { table: '"Comment"', name: '"Comment_userId_fkey"' },
    { table: '"Like"', name: '"Like_userId_fkey"' },
    { table: '"StudentPost"', name: '"StudentPost_authorId_fkey"' },
  ];

  await prisma.$transaction(async (tx) => {
    // 1. Get all users
    const users = await tx.user.findMany({ orderBy: { createdAt: "asc" } });
    if (users.length === 0) return;

    // 2. Create mapping
    const mapping = users.map((u, i) => ({ oldId: u.id, newId: (700000001 + i).toString() }));

    // 3. Drop Constraints
    console.log("Dropping constraints...");
    for (const c of constraints) {
      try {
        await tx.$executeRawUnsafe(`ALTER TABLE ${c.table} DROP CONSTRAINT ${c.name}`);
      } catch (e) {
        console.warn(`Could not drop constraint ${c.name} on ${c.table}, might already be gone.`);
      }
    }

    console.log("Updating IDs...");
    for (const m of mapping) {
      console.log(`Migrating: ${m.oldId} -> ${m.newId}`);

      const tables = [
        { name: '"UserRole"', col: '"userId"' },
        { name: '"Profile"', col: '"userId"' },
        { name: '"Account"', col: '"userId"' },
        { name: '"Session"', col: '"userId"' },
        { name: '"Article"', col: '"authorId"' },
        { name: '"Video"', col: '"authorId"' },
        { name: '"ResearchPaper"', col: '"authorId"' },
        { name: '"Image"', col: '"authorId"' },
        { name: '"Comment"', col: '"userId"' },
        { name: '"Like"', col: '"userId"' },
        { name: '"StudentPost"', col: '"authorId"' },
      ];

      for (const table of tables) {
        await tx.$executeRawUnsafe(
          `UPDATE ${table.name} SET ${table.col} = $1 WHERE ${table.col} = $2`,
          m.newId, m.oldId
        );
      }

      await tx.$executeRawUnsafe(
        'UPDATE "User" SET id = $1 WHERE id = $2',
        m.newId, m.oldId
      );
    }
    
    console.log("Updates complete. Please run 'npx prisma migrate dev' to re-apply constraints.");
  }, { timeout: 60000 });
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
