import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canModerate } from "@/lib/moderation";
import { Role } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const moderatorRole = (session.user as any).role as Role;
    const commentId = params.id;

    // Fetch comment and user to determine target role
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    const targetRole = comment.isGuest ? Role.GUEST : (comment.user?.role || Role.GUEST);

    if (!canModerate(moderatorRole, targetRole)) {
      return new NextResponse("Forbidden: You do not have permission to moderate this user.", { status: 403 });
    }

    // Perform moderation action (e.g., delete)
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return new NextResponse("Comment moderated successfully", { status: 200 });
  } catch (error) {
    console.error("COMMENT_MODERATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
