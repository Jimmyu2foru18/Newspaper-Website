const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const roleNames = ["GUEST", "STUDENT", "STAFF", "FACULTY", "ADMIN", "SUPER_ADMIN"];
  
  for (const name of roleNames) {
      await prisma.role.upsert({
          where: { name },
          update: {},
          create: { name }
      });
      console.log(`Ensured role exists: ${name}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
