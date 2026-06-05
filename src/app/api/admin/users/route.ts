import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).roles.includes("SUPER_ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { firstName, lastName, email, role } = await req.json();

    if (!firstName || !lastName || !email || !role) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);
    const roleEntry = await prisma.role.findUnique({ where: { name: role } });

    if (!roleEntry) {
      return new NextResponse("Role not found", { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
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
