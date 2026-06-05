import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).roles?.includes("FACULTY")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { staffId, action } = await req.json();
    const facultyId = (session.user as any).id;

    await prisma.user.update({
      where: { id: staffId },
      data: {
        facultyId: action === "assign" ? facultyId : null
      }
    });

    return new NextResponse("Monitoring updated", { status: 200 });
  } catch (error) {
    console.error("MONITOR_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
