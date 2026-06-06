import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { Download, FileText, Quote } from "lucide-react";
import Link from "next/link";
import { CommentSection } from "@/components/engagement/CommentSection";

interface PaperPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { slug } = await params;

  const paper = await prisma.researchPaper.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
    },
  });

  if (!paper) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
            {paper.category.name}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {format(new Date(paper.createdAt), "MMMM d, yyyy")}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold serif-text text-gray-900 leading-tight mb-6">
          {paper.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg">
            <p><strong>Author:</strong> {paper.author.firstName} {paper.author.lastName}</p>
            {paper.citation && <p><strong>Citation:</strong> {paper.citation}</p>}
        </div>
      </div>

      <div className="prose prose-lg max-w-none serif-text prose-headings:serif-text prose-primary">
          <h3 className="text-xl font-bold">Abstract</h3>
          <p>{paper.abstract}</p>
          {paper.content && <div dangerouslySetInnerHTML={{ __html: paper.content }} />}
      </div>

      <div className="mt-12">
        {paper.pdfUrl && (
            <Link 
                href={paper.pdfUrl} 
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all"
            >
                <Download className="h-5 w-5" />
                Download Full Paper
            </Link>
        )}
      </div>

      <div className="mt-16 pt-8 border-t">
        <CommentSection paperId={paper.id} />
      </div>
    </article>
  );
}
