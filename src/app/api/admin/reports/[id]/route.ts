import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const roles = (session?.user as any)?.roles as string[];
    
    // Only Faculty, Admin, SuperAdmin can resolve reports
    if (!session || !roles || !roles.some(r => ["FACULTY", "ADMIN", "SUPER_ADMIN"].includes(r))) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.report.delete({
      where: { id: params.id }
    });

    return new NextResponse("Report resolved", { status: 200 });
  } catch (error) {
    console.error("REPORT_DELETE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
