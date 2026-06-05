const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: "Super Admin", email: "superadmin@oldwestbury.edu", role: "SUPER_ADMIN" },
    { name: "Staff User", email: "staff@oldwestbury.edu", role: "STAFF" },
    { name: "Faculty User", email: "faculty@oldwestbury.edu", role: "FACULTY" },
    { name: "Student User", email: "student@oldwestbury.edu", role: "STUDENT" },
    { name: "Guest User", email: "guest@oldwestbury.edu", role: "GUEST" }
  ];
  
  for (const { name, email, role } of users) {
    const password = await bcrypt.hash("password123", 10);
    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ");
    
    // Assign a predictable ID for seeded users to keep them consistent
    const id = email.includes("superadmin") ? "700000001" : 
               email.includes("staff") ? "700000002" : 
               email.includes("faculty") ? "700000003" : 
               email.includes("student") ? "700000004" : "700000005";

    await prisma.user.upsert({
      where: { email },
      update: { password, firstName, lastName },
      create: {
        id,
        firstName,
        lastName,
        email,
        password,
      },
    });

    // Assign roles
    const roleEntry = await prisma.role.findUnique({ where: { name: role } });
    if (roleEntry) {
        await prisma.userRole.upsert({
            where: { userId_roleId: { userId: id, roleId: roleEntry.id } },
            update: {},
            create: { userId: id, roleId: roleEntry.id }
        });
    }
  }

  const categories = [
    { name: "Campus News", slug: "campus-news" },
    { name: "Student Life", slug: "student-life" },
    { name: "Academic Journals", slug: "academic-journals" },
    { name: "Research Papers", slug: "research-papers" },
    { name: "Editorials", slug: "editorials" },
    { name: "Sports", slug: "sports" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("Seeded database successfully with Faculty role and @oldwestbury.edu emails.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
