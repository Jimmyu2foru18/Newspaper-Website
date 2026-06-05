const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const roles = ["ADMIN", "EDITOR", "STUDENT", "GUEST"];
  
  for (const role of roles) {
    const email = `${role.toLowerCase()}@test.com`;
    const password = await bcrypt.hash("password123", 10);
    
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: `${role.charAt(0) + role.slice(1).toLowerCase()} User`,
        email,
        password,
        role,
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

  console.log("Seeded database successfully with roles and categories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
