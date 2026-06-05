import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = params.id;
    await prisma.user.delete({ where: { id: userId } });

    return new NextResponse("User deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: params.id } });
    const actorRole = (session.user as any).role;

    if (!targetUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Only allow PATCH if:
    // 1. Actor is SUPER_ADMIN
    // 2. Actor is ADMIN and target is not ADMIN or SUPER_ADMIN
    const canPatch = actorRole === "SUPER_ADMIN" || 
      (actorRole === "ADMIN" && targetUser.role !== "ADMIN" && targetUser.role !== "SUPER_ADMIN");

    if (!canPatch) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { name, role } = await req.json();

    await prisma.user.update({
      where: { id: params.id },
      data: { name, role }
    });

    return new NextResponse("User updated successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
