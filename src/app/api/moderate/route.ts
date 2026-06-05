import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canModerate, canApproveContent } from "@/lib/moderation";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { type, id, action, feedback } = await req.json();
    const moderatorRoles = (session.user as any).roles as string[];

    let content;
    const includeAuthor = { include: { author: { include: { roles: { include: { role: true } } } } } };

    if (type === "article") content = await prisma.article.findUnique({ where: { id }, ...includeAuthor });
    else if (type === "video") content = await prisma.video.findUnique({ where: { id }, ...includeAuthor });
    else if (type === "paper") content = await prisma.researchPaper.findUnique({ where: { id }, ...includeAuthor });
    else if (type === "studentPost") content = await prisma.studentPost.findUnique({ 
        where: { id }, 
        include: { author: { include: { roles: { include: { role: true } } } } } 
    });
    else if (type === "comment") content = await prisma.comment.findUnique({ 
        where: { id }, 
        include: { 
            user: { include: { roles: { include: { role: true } } } },
            ...((prisma as any).image ? { image: true } : {})
        } 
    });

    if (!content) {
      return new NextResponse("Content not found", { status: 404 });
    }

    // Determine target roles (author of the content)
    let targetRoles: string[] = [];
    if (type === "comment") {
        if ((content as any).isGuest || !(content as any).user) {
            targetRoles = ["GUEST"];
        } else {
            targetRoles = (content as any).user.roles.map((r: any) => r.role.name);
        }
    } else if (type === "studentPost") {
        targetRoles = (content as any).author.roles.map((r: any) => r.role.name);
    } else {
        targetRoles = (content as any).author.roles.map((r: any) => r.role.name);
    }

    if (!canModerate(moderatorRoles, targetRoles)) {
      return new NextResponse("Forbidden: You do not have permission to moderate this content.", { status: 403 });
    }

    if (type !== "comment" && !canApproveContent(moderatorRoles)) {
        return new NextResponse("Forbidden: You do not have permission to approve/reject content.", { status: 403 });
    }

    // Perform action
    if (type === "article") {
      await prisma.article.update({
        where: { id },
        data: { approvalStatus: action === "approve" ? "APPROVED" : "REJECTED" },
      });
    } else if (type === "video") {
      await prisma.video.update({
        where: { id },
        data: { approvalStatus: action === "approve" ? "APPROVED" : "REJECTED" },
      });
    } else if (type === "paper") {
      await prisma.researchPaper.update({
        where: { id },
        data: { approvalStatus: action === "approve" ? "APPROVED" : "REJECTED" },
      });
    } else if (type === "studentPost") {
        await prisma.studentPost.update({ 
            where: { id },
            data: { 
                status: action === "approve" ? "APPROVED" : "REJECTED",
                feedback: feedback || (action === "approve" ? "Submission approved!" : "Submission denied.")
            } 
        });
    } else if (type === "comment") {
      await prisma.comment.delete({
        where: { id },
      });
    }

    return new NextResponse(`Content ${action}d successfully`, { status: 200 });
  } catch (error) {
    console.error("CONTENT_MODERATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
