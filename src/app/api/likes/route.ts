import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { imageId, articleId, videoId } = await req.json();
    const userId = (session.user as any).id;

    if (!imageId && !articleId && !videoId) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    if (!(prisma as any).like) {
        return new NextResponse("Feature not ready", { status: 503 });
    }

    // Toggle like
    const existingLike = await (prisma as any).like.findFirst({
        where: {
            userId,
            imageId: imageId || undefined,
            articleId: articleId || undefined,
            videoId: videoId || undefined,
        }
    });

    if (existingLike) {
        await prisma.like.delete({
            where: { id: existingLike.id }
        });
        return NextResponse.json({ liked: false });
    } else {
        await prisma.like.create({
            data: {
                userId,
                imageId: imageId || undefined,
                articleId: articleId || undefined,
                videoId: videoId || undefined,
            }
        });
        return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("LIKE_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");
    const articleId = searchParams.get("articleId");
    const videoId = searchParams.get("videoId");

    if (!imageId && !articleId && !videoId) {
        return new NextResponse("Missing ID", { status: 400 });
    }

    try {
        if (!(prisma as any).like) {
            return NextResponse.json({ count: 0, userLiked: false });
        }

        const count = await (prisma as any).like.count({
            where: {
                imageId: imageId || undefined,
                articleId: articleId || undefined,
                videoId: videoId || undefined,
            }
        });

        const session = await getServerSession(authOptions);
        let userLiked = false;

        if (session?.user) {
            const like = await (prisma as any).like.findFirst({
                where: {
                    userId: (session.user as any).id,
                    imageId: imageId || undefined,
                    articleId: articleId || undefined,
                    videoId: videoId || undefined,
                }
            });
            userLiked = !!like;
        }

        return NextResponse.json({ count, userLiked });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
