import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { Download, FileText, Quote } from "lucide-react";
import Link from "next/link";
import { CommentSection } from "@/components/engagement/CommentSection";

interface PaperPageProps {
  params: {
    slug: string;
  };
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { slug } = params;

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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/journals" className="text-sm font-bold text-primary hover:underline">
            Journals
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">{paper.category.name}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold serif-text text-gray-900 leading-tight mb-8">
          {paper.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {paper.author.name?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{paper.author.name}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Lead Researcher</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            {paper.pdfUrl && (
              <Link 
                href={paper.pdfUrl} 
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          <section className="mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 border-b pb-2">Abstract</h2>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 italic text-gray-700 leading-relaxed serif-text text-lg">
              {paper.abstract}
            </div>
          </section>

          {paper.content && (
            <section className="mb-12">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 border-b pb-2">Full Text</h2>
              <div 
                className="prose prose-lg max-w-none serif-text prose-primary"
                dangerouslySetInnerHTML={{ __html: paper.content }}
              />
            </section>
          )}

          <div className="mt-16 pt-8 border-t">
            <CommentSection paperId={paper.id} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <Quote className="h-3 w-3" />
                Cite this work
              </h3>
              <div className="text-xs text-gray-600 bg-white border p-4 rounded-lg leading-relaxed font-mono">
                {paper.citation || `${paper.author.name} (${format(new Date(paper.createdAt), "yyyy")}). ${paper.title}. Old Westbury Catalyst.`}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
               <FileText className="h-8 w-8 text-primary mb-4" />
               <h4 className="font-bold text-primary mb-2 serif-text">Catalyst Journals</h4>
               <p className="text-xs text-gray-600 leading-relaxed">
                 All papers published in the Catalyst undergo a student-led peer review process to ensure academic integrity.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
