import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canManageContent } from "@/lib/permissions";

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
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if user can create content
    if (!canManageContent(user, { authorId: user.id }, "create")) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { title, description, url, categoryId, thumbnailUrl } = body;

    if (!title || !url || !categoryId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

    const isStudent = user.role === "STUDENT";

    const video = await prisma.video.create({
      data: {
        title,
        description,
        url,
        thumbnailUrl,
        slug,
        categoryId,
        published: isStudent ? false : true,
        authorId: user.id,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("VIDEO_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
// GET remains the same
