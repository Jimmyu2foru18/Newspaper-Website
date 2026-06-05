import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const roles = (session?.user as any)?.roles as string[];
    
    // Only Faculty, Admin, SuperAdmin can report
    if (!session || !roles || !roles.some(r => ["FACULTY", "ADMIN", "SUPER_ADMIN"].includes(r))) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { commentId, reason } = await req.json();

    if (!commentId || !reason) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await prisma.report.create({
      data: {
        commentId,
        reason,
        reporterId: (session.user as any).id
      }
    });

    return new NextResponse("Comment reported", { status: 200 });
  } catch (error) {
    console.error("REPORT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
