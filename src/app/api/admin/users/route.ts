import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { canManageUser } from "@/lib/permissions";
import { getNextStudentId as getNextId } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const actorRoles = (session.user as any).roles;
    const actorId = (session.user as any).id;

    const { firstName, lastName, email, role } = await req.json();

    if (!firstName || !lastName || !email || !role) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Check if actor can create a user with this role
    const targetRoles = [role];
    if (!canManageUser({ id: actorId, roles: actorRoles }, { id: "new", roles: targetRoles }, "create")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);
    const roleEntry = await prisma.role.findUnique({ where: { name: role } });

    if (!roleEntry) {
      return new NextResponse("Role not found", { status: 400 });
    }

    const newId = await getNextId();

    const user = await prisma.user.create({
      data: {
        id: newId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roles: {
          create: {
            roleId: roleEntry.id,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("USER_CREATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
