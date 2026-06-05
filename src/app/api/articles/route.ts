import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canCreateContent, getHighestRole, ROLE_HIERARCHY } from "@/lib/permissions";

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
      return new NextResponse("User not found", { status: 404 });
    }

    const userWithRoles = {
      ...user,
      roles: user.roles.map((r) => r.role.name),
    };

    // Check if user can create content
    if (!canCreateContent(userWithRoles.roles, "Article")) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { title, content, categoryId, featuredImage } = body;

    if (!title || !content || !categoryId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

    const highestRole = getHighestRole(userWithRoles.roles);
    const hasStaffRole = userWithRoles.roles.includes("STAFF");
    const approvalStatus = (!hasStaffRole && ROLE_HIERARCHY[highestRole] >= ROLE_HIERARCHY.FACULTY) ? "APPROVED" : "PENDING";

    const article = await prisma.article.create({
      data: {
        title,
        content,
        featuredImage,
        slug,
        categoryId,
        approvalStatus,
        authorId: user.id,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("ARTICLE_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
