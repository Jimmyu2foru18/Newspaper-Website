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

    const article = await prisma.article.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return new NextResponse("Article not found", { status: 404 });
    }

    // Check permission
    if (!canManageContent(
        { id: (session.user as any).id, roles: (session.user as any).roles },
        { authorId: article.authorId },
        "update"
    )) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { title, content, excerpt, featuredImage } = body;

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        content,
        excerpt,
        featuredImage,
        editorId: (session.user as any).id,
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("ARTICLE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const article = await prisma.article.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return new NextResponse("Article not found", { status: 404 });
    }

    // Check permission
    if (!canManageContent(
        { id: (session.user as any).id, roles: (session.user as any).roles },
        { authorId: article.authorId },
        "delete"
    )) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.article.delete({
      where: { id: params.id },
    });

    return new NextResponse("Article deleted", { status: 200 });
  } catch (error) {
    console.error("ARTICLE_DELETE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
