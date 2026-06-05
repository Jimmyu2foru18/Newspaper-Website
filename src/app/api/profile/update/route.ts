import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { bio, avatarUrl, currentPassword, newPassword } = await req.json();
    const userId = (session.user as any).id;

    // Handle Password Update if provided
    if (newPassword) {
        if (!currentPassword) {
            return new NextResponse("Current password required", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });

        if (!user || !user.password) {
            return new NextResponse("User not found", { status: 404 });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return new NextResponse("Incorrect current password", { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });
    }

    // Handle Profile Update
    if (bio !== undefined || avatarUrl !== undefined) {
        await prisma.profile.upsert({
            where: { userId },
            update: { 
                ...(bio !== undefined && { bio }), 
                ...(avatarUrl !== undefined && { avatarUrl }) 
            },
            create: { userId, bio: bio || "", avatarUrl: avatarUrl || "" },
        });
    }

    return new NextResponse("Profile updated successfully", { status: 200 });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
