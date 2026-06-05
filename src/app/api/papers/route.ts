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
    const { title, abstract, content, pdfUrl, citation, categoryId } = body;

    if (!title || !abstract || !categoryId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`;

    const paper = await prisma.researchPaper.create({
      data: {
        title,
        abstract,
        content,
        pdfUrl,
        citation,
        slug,
        categoryId,
        published: true, // For now auto-publish
        authorId: (session.user as any).id,
      },
    });

    return NextResponse.json(paper);
  } catch (error) {
    console.error("PAPER_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const papers = await prisma.researchPaper.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(papers);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
