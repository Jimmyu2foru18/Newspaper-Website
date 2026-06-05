import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canModerate } from "@/lib/moderation";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { type, id, action } = await req.json();
    const moderatorRole = (session.user as any).role as Role;

    let content;
    if (type === "article") content = await prisma.article.findUnique({ where: { id }, include: { author: true } });
    else if (type === "video") content = await prisma.video.findUnique({ where: { id }, include: { author: true } });
    else if (type === "paper") content = await prisma.researchPaper.findUnique({ where: { id }, include: { author: true } });

    if (!content) {
      return new NextResponse("Content not found", { status: 404 });
    }

    // Determine target role (author of the content)
    const targetRole = content.author.role;

    if (!canModerate(moderatorRole, targetRole)) {
      return new NextResponse("Forbidden: You do not have permission to moderate this content.", { status: 403 });
    }

    // Perform action
    if (type === "article") {
      await prisma.article.update({
        where: { id },
        data: { published: action === "approve" },
      });
    } else if (type === "video") {
      await prisma.video.update({
        where: { id },
        data: { published: action === "approve" },
      });
    } else if (type === "paper") {
      await prisma.researchPaper.update({
        where: { id },
        data: { published: action === "approve" },
      });
    } else if (type === "comment") {
      await prisma.comment.update({
        where: { id },
        data: { status: action === "approve" ? "APPROVED" : "REJECTED" },
      });
    }

    return new NextResponse(`Content ${action}d successfully`, { status: 200 });
  } catch (error) {
    console.error("CONTENT_MODERATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
