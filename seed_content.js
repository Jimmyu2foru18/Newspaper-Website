const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const STAFF_ID = 'cmq1buxn200014p9gio4n74ag';
const FACULTY_ID = 'cmq1buxoo00024p9gfvql2l4z';
const CATEGORY_ID = 'cmq1buxrv00054p9gv958ksob';

async function main() {
  const users = [STAFF_ID, FACULTY_ID];
  
  for (const authorId of users) {
    for (let i = 1; i <= 3; i++) {
        // Articles
        await prisma.article.create({
            data: {
                title: `Post ${i} by ${authorId === STAFF_ID ? 'Staff' : 'Faculty'}`,
                slug: `post-${authorId}-${i}-${Math.random().toString(36).substring(7)}`,
                content: "Content",
                authorId,
                categoryId: CATEGORY_ID,
                published: true
            }
        });
        
        // Videos
        await prisma.video.create({
            data: {
                title: `Video ${i} by ${authorId === STAFF_ID ? 'Staff' : 'Faculty'}`,
                slug: `video-${authorId}-${i}-${Math.random().toString(36).substring(7)}`,
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                authorId,
                categoryId: CATEGORY_ID,
                published: true
            }
        });
        
        // Papers
        await prisma.researchPaper.create({
            data: {
                title: `Paper ${i} by ${authorId === STAFF_ID ? 'Staff' : 'Faculty'}`,
                slug: `paper-${authorId}-${i}-${Math.random().toString(36).substring(7)}`,
                abstract: "Abstract",
                authorId,
                categoryId: CATEGORY_ID,
                published: true
            }
        });
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
