const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.findMany();
  console.log("Roles in DB:", roles);

  const users = await prisma.user.findMany();

  const roleMap = roles.reduce((acc, r) => ({ ...acc, [r.name]: r.id }), {});

  const assignments = [
    { email: "superadmin@oldwestbury.edu", roleName: "SUPER_ADMIN" },
    { email: "staff@oldwestbury.edu", roleName: "STAFF" },
    { email: "faculty@oldwestbury.edu", roleName: "FACULTY" },
    { email: "student@oldwestbury.edu", roleName: "STUDENT" },
  ];

  for (const { email, roleName } of assignments) {
    const user = users.find(u => u.email === email);
    const roleId = roleMap[roleName];
    
    if (user && roleId) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: roleId } },
        update: {},
        create: { userId: user.id, roleId: roleId }
      });
      console.log(`Assigned ${roleName} to ${email}`);
    } else {
      console.log(`Failed to assign ${roleName} to ${email}. User/Role missing.`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
