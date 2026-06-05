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

    const { content } = await req.json();
    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const post = await prisma.studentPost.create({
      data: {
        content,
        authorId: (session.user as any).id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("STUDENT_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
