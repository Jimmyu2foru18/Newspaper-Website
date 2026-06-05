import Link from "next/link";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { BookOpen, Download, FileText } from "lucide-react";

export default async function JournalsPage() {
  const papers = await prisma.researchPaper.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold serif-text text-primary mb-4">Academic Journals & Research</h1>
          <p className="text-gray-600 max-w-2xl">
            Explore scholarly publications, research papers, and academic journals authored by SUNY Old Westbury students and faculty.
          </p>
        </div>
        <Link
          href="/publish?type=paper"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
        >
          Submit Paper
        </Link>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-gray-50">
          <p className="text-gray-500 italic">No academic papers published yet.</p>
          <div className="text-6xl mt-4 opacity-10">🎓</div>
        </div>
      ) : (
        <div className="space-y-6">
          {papers.map((paper) => (
            <div 
              key={paper.id} 
              className="group border rounded-xl p-8 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                      {paper.category.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      Published {format(new Date(paper.createdAt), "MMMM yyyy")}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 serif-text group-hover:text-primary transition-colors leading-tight">
                    {paper.title}
                  </h2>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary text-sm font-bold">
                      {paper.author.firstName?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{paper.author.firstName} {paper.author.lastName}</span>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Abstract</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                      {paper.abstract}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href={`/journals/${paper.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                    >
                      <BookOpen className="h-4 w-4" />
                      Read Full Text
                    </Link>
                    {paper.pdfUrl && (
                      <Link 
                        href={paper.pdfUrl} 
                        target="_blank"
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Link>
                    )}
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center w-32 h-40 bg-gray-100 rounded border-2 border-dashed border-gray-200 text-gray-300">
                   <FileText className="h-12 w-12 mb-2" />
                   <span className="text-[10px] uppercase font-bold tracking-tighter">Catalyst Paper</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
