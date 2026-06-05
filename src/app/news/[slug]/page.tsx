import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { CommentSection } from "@/components/engagement/CommentSection";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            {article.category.name}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {format(new Date(article.createdAt), "MMMM d, yyyy")}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold serif-text text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {article.author.name?.charAt(0)}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{article.author.name}</p>
            <p className="text-xs text-gray-500">Catalyst Contributor</p>
          </div>
        </div>
      </div>

      {article.featuredImage && (
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
          <img 
            src={article.featuredImage} 
            alt={article.title} 
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none serif-text prose-headings:serif-text prose-primary"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mt-16 pt-8 border-t">
        <CommentSection articleId={article.id} />
      </div>
    </article>
  );
}
