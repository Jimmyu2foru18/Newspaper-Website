import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canCreateContent } from "@/lib/permissions";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      import { canCreateContent, getHighestRole, ROLE_HIERARCHY } from "@/lib/permissions";

      // ... (slugify)

      export async function POST(req: Request) {
        try {
          // ... (session/user check)
          // ... (userWithRoles)

          // Check if user can create content
          if (!canCreateContent(userWithRoles.roles, "ResearchPaper")) {
              return new NextResponse("Forbidden", { status: 403 });
          }

          const body = await req.json();
          const { title, abstract, categoryId, pdfUrl, imageUrl, content, citation } = body;

          if (!title || !abstract || !categoryId) {
            return new NextResponse("Missing fields", { status: 400 });
          }

          const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

          const highestRole = getHighestRole(userWithRoles.roles);
          const hasStaffRole = userWithRoles.roles.includes("STAFF");
          const approvalStatus = (!hasStaffRole && ROLE_HIERARCHY[highestRole] >= ROLE_HIERARCHY.FACULTY) ? "APPROVED" : "PENDING";
          const paper = await prisma.researchPaper.create({
            data: {
              title,
              abstract,
              pdfUrl,
              imageUrl,
              content,
              citation,
              slug,
              categoryId,
              approvalStatus,
              authorId: user.id,
            },
          });

          return NextResponse.json(paper);
        } catch (error) {
          console.error("PAPER_POST_ERROR", error);
          return new NextResponse("Internal Error", { status: 500 });
        }
      }

      export async function GET() {
        try {
          const papers = await prisma.researchPaper.findMany({
            where: {
              approvalStatus: "APPROVED",
            },
            include: {
              author: true,
              category: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });
          return NextResponse.json(papers);
        } catch (error) {
          return new NextResponse("Internal Error", { status: 500 });
        }
      }

