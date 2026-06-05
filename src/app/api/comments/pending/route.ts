import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "FACULTY", "STAFF"].includes((session.user as any).role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        status: "PENDING",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
