import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateGuestName } from "@/lib/guest";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { content, articleId, videoId, paperId, parentId, isAnonymous, guestName: providedGuestName, guestEmail } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    let guestName = null;
    let isGuest = false;

    if (!session || isAnonymous) {
      guestName = providedGuestName || generateGuestName();
      isGuest = true;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        videoId,
        paperId,
        parentId,
        userId: session?.user ? (session.user as any).id : null,
        guestName,
        guestEmail,
        isGuest,
        status: isGuest ? "PENDING" : "APPROVED",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("COMMENT_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get("articleId");
  const videoId = searchParams.get("videoId");
  const paperId = searchParams.get("paperId");

  try {
    const comments = await prisma.comment.findMany({
      where: {
        articleId: articleId || undefined,
        videoId: videoId || undefined,
        paperId: paperId || undefined,
        parentId: null, // Only fetch top-level comments
        status: "APPROVED",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("COMMENT_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
