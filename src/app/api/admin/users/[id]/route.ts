import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canManageUser } from "@/lib/permissions";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const actorId = (session.user as any).id;
    const actorRoles = (session.user as any).roles;
    
    const targetUser = await prisma.user.findUnique({ 
        where: { id: params.id },
        include: { roles: { include: { role: true } } }
    });
    
    if (!targetUser) return new NextResponse("User not found", { status: 404 });
    
    const targetRoles = targetUser.roles.map(r => r.role.name);

    if (!canManageUser({ id: actorId, roles: actorRoles }, { id: targetUser.id, roles: targetRoles }, "delete")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.user.delete({ where: { id: params.id } });

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
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const targetUser = await prisma.user.findUnique({ 
        where: { id: params.id },
        include: { roles: { include: { role: true } } }
    });
    
    if (!targetUser) return new NextResponse("User not found", { status: 404 });

    const actorId = (session.user as any).id;
    const actorRoles = (session.user as any).roles;
    const targetRoles = targetUser.roles.map(r => r.role.name);

    if (!canManageUser({ id: actorId, roles: actorRoles }, { id: targetUser.id, roles: targetRoles }, "update")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { name, roleNames } = await req.json();

    if (name) {
        await prisma.user.update({
            where: { id: params.id },
            data: { name }
        });
    }

    if (roleNames) {
        const roles = await prisma.role.findMany({ where: { name: { in: roleNames } } });
        await prisma.userRole.deleteMany({ where: { userId: params.id } });
        await prisma.userRole.createMany({
            data: roles.map(r => ({ userId: params.id, roleId: r.id }))
        });
    }

    return new NextResponse("User updated successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
