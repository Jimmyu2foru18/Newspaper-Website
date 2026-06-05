import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getNextStudentId } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (exists) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = await getNextStudentId();

    const user = await prisma.user.create({
      data: {
        id: newId,
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    const studentRole = await prisma.role.findUnique({ where: { name: "STUDENT" } });
    if (!studentRole) {
        console.error("CRITICAL: STUDENT role not found in database during registration");
        return new NextResponse("Internal Configuration Error", { status: 500 });
    }

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: studentRole.id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
