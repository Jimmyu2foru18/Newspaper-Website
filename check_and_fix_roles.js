const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { roles: { include: { role: true } } }
  });
  
  console.log("Current Users and Roles:", JSON.stringify(users.map(u => ({
      email: u.email,
      roles: u.roles.map(r => r.role.name)
  })), null, 2));

  // Find Role IDs
  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });

  // Example: Ensure admin@oldwestbury.edu is SUPER_ADMIN
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@oldwestbury.edu" } });
  
  if (adminUser && superAdminRole) {
      await prisma.userRole.upsert({
          where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
          update: {},
          create: { userId: adminUser.id, roleId: superAdminRole.id }
      });
      console.log("Updated admin@oldwestbury.edu to SUPER_ADMIN");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
