const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Ensure all roles exist before assigning them to users
  const roleNames = ["GUEST", "STUDENT", "STAFF", "FACULTY", "ADMIN", "SUPER_ADMIN"];
  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const users = [
    { id: "700000001", name: "Super Admin", email: "superadmin@oldwestbury.edu", role: "SUPER_ADMIN" },
    { id: "700000002", name: "Staff User", email: "staff@oldwestbury.edu", role: "STAFF" },
    { id: "700000003", name: "Faculty User", email: "faculty@oldwestbury.edu", role: "FACULTY" },
    { id: "700000004", name: "Student User", email: "student@oldwestbury.edu", role: "STUDENT" },
    { id: "700000005", name: "Guest User", email: "guest@oldwestbury.edu", role: "GUEST" },
    { id: "700000006", name: "Admin User", email: "admin@oldwestbury.edu", role: "ADMIN" },
  ];

  for (const { id, name, email, role } of users) {
    const password = await bcrypt.hash("password123", 10);
    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ");

    await prisma.user.upsert({
      where: { email },
      update: { password, firstName, lastName },
      create: { id, firstName, lastName, email, password },
    });

    const roleEntry = await prisma.role.findUnique({ where: { name: role } });
    if (roleEntry) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: id, roleId: roleEntry.id } },
        update: {},
        create: { userId: id, roleId: roleEntry.id },
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

  // Helper to fetch category id by slug
  const cat = {};
  for (const c of await prisma.category.findMany()) cat[c.slug] = c.id;

  const authorId = "700000002"; // Staff User as default author
  const editorId = "700000001"; // Super Admin as editor

  // ---- Articles ----
  const articles = [
    {
      title: "Old Westbury Unveils New Science Center",
      slug: "new-science-center",
      excerpt: "The college opens a state-of-the-art research facility for students and faculty.",
      content:
        "Old Westbury celebrated the grand opening of its new Science Center this week, a milestone years in the making. The facility features modern laboratories, collaborative study spaces, and cutting-edge research equipment.\n\nStudents and faculty alike praised the new space, which is expected to expand research opportunities across biology, chemistry, and environmental science programs.",
      categorySlug: "campus-news",
      featured: true,
      featuredImage: "/seed/research-lab.png",
    },
    {
      title: "Panthers Clinch Conference Basketball Title",
      slug: "panthers-basketball-title",
      excerpt: "A thrilling overtime win secures the championship for the home team.",
      content:
        "In a packed arena, the Old Westbury Panthers secured the conference basketball title with a dramatic overtime victory. The win caps a remarkable season for the program.\n\nFans stormed the court as the final buzzer sounded, celebrating the team's first title in over a decade.",
      categorySlug: "sports",
      featured: true,
      featuredImage: "/seed/basketball-game.png",
    },
    {
      title: "Student Clubs Welcome Record Membership This Fall",
      slug: "student-clubs-record-membership",
      excerpt: "Campus organizations report a surge in new members and fresh initiatives.",
      content:
        "Student organizations across campus are reporting record membership this fall. From the debate society to the environmental coalition, clubs are buzzing with new energy.\n\nClub leaders attribute the growth to an expanded activities fair and renewed in-person programming.",
      categorySlug: "student-life",
      featured: false,
      featuredImage: "/seed/student-club.png",
    },
    {
      title: "Reflections on a Changing Campus",
      slug: "reflections-changing-campus",
      excerpt: "An editorial on growth, community, and the road ahead.",
      content:
        "As our campus continues to evolve, it is worth pausing to reflect on what makes this community special. Change brings both challenges and opportunities.\n\nThis editorial explores how students and faculty can shape the future together while honoring the traditions that define us.",
      categorySlug: "editorials",
      featured: false,
      featuredImage: "/seed/sunset-campus.png",
    },
  ];

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        approvalStatus: "APPROVED",
        featured: a.featured,
        featuredImage: a.featuredImage,
      },
      create: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        approvalStatus: "APPROVED",
        featured: a.featured,
        featuredImage: a.featuredImage,
        authorId,
        editorId,
        categoryId: cat[a.categorySlug],
      },
    });
  }

  // ---- Videos ----
  const videos = [
    {
      title: "Campus Tour 2026",
      slug: "campus-tour-2026",
      description: "Take a walk through the beautiful Old Westbury campus.",
      url: "https://www.youtube.com/embed/aqz-KE-bpKQ",
      thumbnailUrl: "/seed/campus-quad.png",
      categorySlug: "student-life",
    },
    {
      title: "Inside the Lecture Hall: A Day in the Life",
      slug: "day-in-the-life-lecture",
      description: "Follow a student through a typical day of classes.",
      url: "https://www.youtube.com/embed/aqz-KE-bpKQ",
      thumbnailUrl: "/seed/lecture-hall.png",
      categorySlug: "campus-news",
    },
  ];

  for (const v of videos) {
    await prisma.video.upsert({
      where: { slug: v.slug },
      update: { approvalStatus: "APPROVED", thumbnailUrl: v.thumbnailUrl },
      create: {
        title: v.title,
        slug: v.slug,
        description: v.description,
        url: v.url,
        thumbnailUrl: v.thumbnailUrl,
        approvalStatus: "APPROVED",
        authorId,
        editorId,
        categoryId: cat[v.categorySlug],
      },
    });
  }

  // ---- Images (photo gallery) ----
  const images = [
    { title: "Autumn on the Quad", slug: "autumn-quad", url: "/seed/campus-quad.png", categorySlug: "student-life" },
    { title: "Late Night Study Session", slug: "library-study", url: "/seed/library-study.png", categorySlug: "student-life" },
    { title: "Graduation Day", slug: "graduation-day", url: "/seed/graduation.png", categorySlug: "campus-news" },
    { title: "Sunset Over Campus", slug: "sunset-campus", url: "/seed/sunset-campus.png", categorySlug: "campus-news" },
  ];

  for (const img of images) {
    await prisma.image.upsert({
      where: { slug: img.slug },
      update: { approvalStatus: "APPROVED", url: img.url },
      create: {
        title: img.title,
        slug: img.slug,
        url: img.url,
        approvalStatus: "APPROVED",
        authorId,
        editorId,
        categoryId: cat[img.categorySlug],
      },
    });
  }

  // ---- Research Papers / Journals ----
  const papers = [
    {
      title: "Sustainable Energy Solutions for Coastal Campuses",
      slug: "sustainable-energy-coastal",
      abstract:
        "This paper examines renewable energy strategies tailored to coastal academic institutions, with a focus on wind and solar integration.",
      content:
        "Coastal campuses face unique energy challenges and opportunities. This study analyzes the feasibility of hybrid renewable systems...",
      citation: "Smith, J. (2026). Sustainable Energy Solutions for Coastal Campuses. OW Journal of Science.",
      categorySlug: "research-papers",
      imageUrl: "/seed/research-lab.png",
    },
    {
      title: "The Impact of Student Journalism on Campus Discourse",
      slug: "student-journalism-discourse",
      abstract:
        "An analysis of how independent student publications shape dialogue and civic engagement within university communities.",
      content:
        "Student journalism plays a pivotal role in fostering open dialogue. This paper reviews case studies across several institutions...",
      citation: "Doe, A. (2026). The Impact of Student Journalism on Campus Discourse. OW Academic Journal.",
      categorySlug: "academic-journals",
      imageUrl: "/seed/library-study.png",
    },
  ];

  for (const p of papers) {
    await prisma.researchPaper.upsert({
      where: { slug: p.slug },
      update: { approvalStatus: "APPROVED", imageUrl: p.imageUrl },
      create: {
        title: p.title,
        slug: p.slug,
        abstract: p.abstract,
        content: p.content,
        citation: p.citation,
        imageUrl: p.imageUrl,
        approvalStatus: "APPROVED",
        authorId,
        editorId,
        categoryId: cat[p.categorySlug],
      },
    });
  }

  console.log("Seeded roles, users (incl. ADMIN), categories, articles, videos, images, and papers.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
