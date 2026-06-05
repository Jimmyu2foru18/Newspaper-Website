import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getHighestRole, ROLE_HIERARCHY } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const roles = (session?.user as any)?.roles || [];
    const highest = getHighestRole(roles);
    
    if (!session || ROLE_HIERARCHY[highest] < ROLE_HIERARCHY.FACULTY) {
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
