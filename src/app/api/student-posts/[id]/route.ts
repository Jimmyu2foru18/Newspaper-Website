import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const postId = id;

    // Verify ownership
    const post = await prisma.studentPost.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });

    if (!post) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (post.authorId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.studentPost.delete({
      where: { id: postId }
    });

    return new NextResponse("Post deleted", { status: 200 });
  } catch (error) {
    console.error("POST_DELETE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
