const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting User ID Migration...");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (users.length === 0) {
    console.log("No users found to migrate.");
    return;
  }

  // Generate new IDs (starting from 700000001)
  const migrations = users.map((user, index) => ({
    oldId: user.id,
    newId: (700000001 + index).toString(),
    email: user.email,
  }));

  console.log(`Planned migration for ${migrations.length} users.`);

  // We must update in an order that respects foreign keys OR use raw SQL to defer constraints if supported
  // Since we are changing PKs, we'll use a transaction and update child tables first if we can't defer.
  // Actually, updating PKs requires updating FKs. 
  // In PostgreSQL, we can use raw SQL to update with SET CONSTRAINTS ALL DEFERRED if the FKs are deferrable.
  // Otherwise, we have to create new users, move data, and delete old users.
  
  // Alternative: Update in a specific order if FKs are NOT deferrable.
  // But many of our FKs are likely not deferrable by default.
  
  await prisma.$transaction(async (tx) => {
    // 1. Disable constraints (Postgres specific for current session/transaction)
    await tx.$executeRawUnsafe('SET CONSTRAINTS ALL DEFERRED');

    for (const m of migrations) {
      console.log(`Migrating ${m.email}: ${m.oldId} -> ${m.newId}`);

      // Update User table (Primary Key)
      // Note: We might need to update child tables FIRST or use raw SQL to avoid FK violations during update
      
      // Using raw SQL for all updates to bypass Prisma's middleware and ensure order/deferred execution
      
      // Tables referencing User(id):
      // UserRole (userId), Profile (userId), Account (userId), Session (userId), 
      // Article (authorId), Video (authorId), ResearchPaper (authorId), Image (authorId),
      // Comment (userId), Like (userId), StudentPost (authorId)

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

      // Finally update the User ID itself
      await tx.$executeRawUnsafe(
        'UPDATE "User" SET id = $1 WHERE id = $2',
        m.newId, m.oldId
      );
    }
  }, {
    timeout: 30000 // 30 seconds
  });

  console.log("Migration completed successfully.");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
