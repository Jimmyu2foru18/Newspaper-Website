const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { role: "ADMIN", email: "admin@oldwestbury.edu" },
    { role: "EDITOR", email: "editor@oldwestbury.edu" },
    { role: "FACULTY", email: "faculty@oldwestbury.edu" },
    { role: "STUDENT", email: "student@oldwestbury.edu" },
    { role: "GUEST", email: "guest@oldwestbury.edu" }
  ];
  
  for (const { role, email } of roles) {
    const password = await bcrypt.hash("password123", 10);
    
    await prisma.user.upsert({
      where: { email },
      update: { password, role },
      create: {
        name: `${role.charAt(0) + role.slice(1).toLowerCase()} User`,
        email,
        password,
        role: role,
      },
    });
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
