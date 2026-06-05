const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "faculty@oldwestbury.edu" } });
  const role = await prisma.role.findUnique({ where: { name: "FACULTY" } });
  
  if (user && role) {
      await prisma.userRole.upsert({
          where: { userId_roleId: { userId: user.id, roleId: role.id } },
          update: {},
          create: { userId: user.id, roleId: role.id }
      });
      console.log("Assigned FACULTY to faculty@oldwestbury.edu");
  } else {
      console.log("User or Role not found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
