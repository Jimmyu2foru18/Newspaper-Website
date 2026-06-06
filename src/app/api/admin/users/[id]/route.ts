import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canManageUser, getHighestRole, ROLE_HIERARCHY } from "@/lib/permissions";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const actorId = (session.user as any).id;
    const actorRoles = (session.user as any).roles;
    
    const targetUser = await prisma.user.findUnique({ 
        where: { id },
        include: { roles: { include: { role: true } } }
    });
    
    if (!targetUser) return new NextResponse("User not found", { status: 404 });
    
    const targetRoles = targetUser.roles.map(r => r.role.name);

    if (!canManageUser({ id: actorId, roles: actorRoles }, { id: targetUser.id, roles: targetRoles }, "delete")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.user.delete({ where: { id } });

    return new NextResponse("User deleted successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const targetUser = await prisma.user.findUnique({ 
        where: { id },
        include: { roles: { include: { role: true } } }
    });
    
    if (!targetUser) return new NextResponse("User not found", { status: 404 });

    const actorId = (session.user as any).id;
    const actorRoles = (session.user as any).roles;
    const targetRoles = targetUser.roles.map(r => r.role.name);

    if (!canManageUser({ id: actorId, roles: actorRoles }, { id: targetUser.id, roles: targetRoles }, "update")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { firstName, lastName, roleNames } = await req.json();

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
            where: { id },
            data: updateData
        });
    }

    if (roleNames && roleNames.length > 0) {
        // Ensure actor can assign ALL requested roles
        const actorHighest = getHighestRole(actorRoles);
        const actorLevel = ROLE_HIERARCHY[actorHighest] || 0;

        for (const roleName of roleNames) {
            const roleLevel = ROLE_HIERARCHY[roleName] || 0;
            if (roleLevel >= actorLevel && actorHighest !== "SUPER_ADMIN") {
                return new NextResponse(`Forbidden: Cannot assign role ${roleName}`, { status: 403 });
            }
        }

        const roles = await prisma.role.findMany({ where: { name: { in: roleNames } } });
        await prisma.userRole.deleteMany({ where: { userId: id } });
        await prisma.userRole.createMany({
            data: roles.map(r => ({ userId: id, roleId: r.id }))
        });
    }

    return new NextResponse("User updated successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
