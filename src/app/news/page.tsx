import Link from "next/link";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ContentActions from "@/components/admin/ContentActions";

export default async function NewsPage() {
  const session = await getServerSession(authOptions);
  const userRoles = (session?.user as any)?.roles || [];
  const currentUserId = (session?.user as any)?.id || "";
  const canPublish = session && userRoles.some((r: string) => ["ADMIN", "SUPER_ADMIN", "FACULTY", "STAFF"].includes(r));

  const articles = await prisma.article.findMany({
    where: {
      approvalStatus: "APPROVED",
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
          <h1 className="text-4xl font-bold serif-text text-primary mb-4">Latest News</h1>
          <p className="text-gray-600 max-w-2xl">
            Stay informed with the latest stories and reports from the SUNY Old Westbury community.
          </p>
        </div>
        {canPublish && (
          <Link
            href="/publish?type=article"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
          >
            Add Article
          </Link>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-gray-50">
          <p className="text-gray-500 italic">No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="group flex flex-col h-full border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              <Link href={`/news/${article.slug}`} className="flex flex-col flex-1">
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
              <div className="px-6 pb-6">
                <ContentActions 
                    contentId={article.id}
                    authorId={article.authorId}
                    contentType="Article"
                    currentUserId={currentUserId}
                    currentUserRoles={userRoles}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
