import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canModerate } from "@/lib/moderation";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const moderatorRoles = (session.user as any).roles as string[];
    const commentId = params.id;

    // Fetch comment and user to determine target roles
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: { include: { roles: { include: { role: true } } } } },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    const targetRoles = comment.isGuest ? ["GUEST"] : (comment.user?.roles.map(r => r.role.name) || ["GUEST"]);

    if (!canModerate(moderatorRoles, targetRoles)) {
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
