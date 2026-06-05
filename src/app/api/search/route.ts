import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ articles: [], videos: [], papers: [] });
  }

  try {
    const [articles, videos, papers] = await Promise.all([
      prisma.article.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { category: true, author: true },
        take: 5,
      }),
      prisma.video.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { category: true, author: true },
        take: 5,
      }),
      prisma.researchPaper.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { abstract: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { category: true, author: true },
        take: 5,
      }),
    ]);

    return NextResponse.json({ articles, videos, papers });
  } catch (error) {
    console.error("SEARCH_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
