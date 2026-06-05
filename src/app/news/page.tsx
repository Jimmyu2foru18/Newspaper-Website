import Link from "next/link";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export default async function NewsPage() {
  const articles = await prisma.article.findMany({
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
      <div className="mb-12">
        <h1 className="text-4xl font-bold serif-text text-primary mb-4">Latest News</h1>
        <p className="text-gray-600 max-w-2xl">
          Stay informed with the latest stories and reports from the SUNY Old Westbury community.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-gray-50">
          <p className="text-gray-500 italic">No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={`/news/${article.slug}`}
              className="group flex flex-col h-full border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              {article.featuredImage ? (
                <div className="aspect-video w-full overflow-hidden">
                   <img 
                    src={article.featuredImage} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                   />
                </div>
              ) : (
                <div className="aspect-video w-full bg-primary/5 flex items-center justify-center">
                  <span className="text-primary/20 font-bold text-4xl serif-text">Catalyst</span>
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                    {article.category.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(article.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-3 serif-text group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                  {article.excerpt || "Click to read the full story..."}
                </p>
                <div className="flex items-center gap-2 pt-4 border-t">
                  <div className="h-6 w-6 rounded-full bg-gray-200" />
                  <span className="text-xs font-medium text-gray-700">By {article.author.firstName} {article.author.lastName}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
