import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canManageContent } from "@/lib/permissions";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const video = await prisma.video.findUnique({
      where: { id: params.id },
    });

    if (!video) {
      return new NextResponse("Video not found", { status: 404 });
    }

    // Check permission
    if (!canManageContent(
        { id: (session.user as any).id, roles: (session.user as any).roles },
        { authorId: video.authorId },
        "update"
    )) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { title, description, url, thumbnailUrl } = body;

    const updatedVideo = await prisma.video.update({
      where: { id: params.id },
      data: {
        title,
        description,
        url,
        thumbnailUrl,
        editorId: (session.user as any).id,
      },
    });

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error("VIDEO_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const video = await prisma.video.findUnique({
      where: { id: params.id },
    });

    if (!video) {
      return new NextResponse("Video not found", { status: 404 });
    }

    // Check permission
    if (!canManageContent(
        { id: (session.user as any).id, roles: (session.user as any).roles },
        { authorId: video.authorId },
        "delete"
    )) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.video.delete({
      where: { id: params.id },
    });

    return new NextResponse("Video deleted", { status: 200 });
  } catch (error) {
    console.error("VIDEO_DELETE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
