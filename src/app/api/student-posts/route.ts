import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canCreateContent } from "@/lib/permissions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const roles = (session.user as any).roles;
    if (!canCreateContent(roles, "StudentPost")) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const { content, facultyId, fileUrl } = await req.json();
    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const post = await prisma.studentPost.create({
      data: {
        content,
        facultyId,
        fileUrl,
        authorId: (session.user as any).id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("STUDENT_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
