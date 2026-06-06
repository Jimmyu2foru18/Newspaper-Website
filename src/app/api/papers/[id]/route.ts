import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canManageContent } from "@/lib/permissions";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const paper = await prisma.researchPaper.findUnique({
      where: { id },
    });

    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Check permission
    if (!canManageContent(
        { id: (session.user as any).id, roles: (session.user as any).roles },
        { authorId: paper.authorId },
        "update"
    )) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { title, abstract, content, pdfUrl, imageUrl, citation } = body;

    const updatedPaper = await prisma.researchPaper.update({
      where: { id },
      data: {
        title,
        abstract,
        content,
        pdfUrl,
        imageUrl,
        citation,
        editorId: (session.user as any).id,
      },
    });

    return NextResponse.json(updatedPaper);
  } catch (error) {
    console.error("PAPER_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const paper = await prisma.researchPaper.findUnique({
      where: { id },
    });

    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 });
    }

    // Check permission
    if (!canManageContent(
        { id: (session.user as any).id, roles: (session.user as any).roles },
        { authorId: paper.authorId },
        "delete"
    )) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.researchPaper.delete({
      where: { id },
    });

    return new NextResponse("Paper deleted", { status: 200 });
  } catch (error) {
    console.error("PAPER_DELETE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
