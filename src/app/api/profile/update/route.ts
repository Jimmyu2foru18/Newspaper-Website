import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { bio, avatarUrl } = await req.json();
    const userId = (session.user as any).id;

    await prisma.profile.upsert({
      where: { userId },
      update: { bio, avatarUrl },
      create: { userId, bio, avatarUrl },
    });

    return new NextResponse("Profile updated", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
