import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    const body = await req.json();
    const { title, description, url, categoryId, thumbnailUrl } = body;

    if (!title || !url || !categoryId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        url,
        thumbnailUrl,
        slug,
        categoryId,
        published: true, // For now auto-publish
        authorId: (session.user as any).id,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("VIDEO_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(videos);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
