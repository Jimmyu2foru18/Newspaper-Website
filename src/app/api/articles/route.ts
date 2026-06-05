import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, categoryId, published } = body;

    if (!title || !content || !categoryId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        slug,
        categoryId,
        published: published || false,
        authorId: (session.user as any).id,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("ARTICLE_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
