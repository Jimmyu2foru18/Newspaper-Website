import Link from "next/link";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { Heart, MessageSquare, ImageIcon } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ContentActions from "@/components/admin/ContentActions";

export default async function ImagesPage() {
  const session = await getServerSession(authOptions);
  const userRoles = (session?.user as any)?.roles || [];
  const currentUserId = (session?.user as any)?.id || "";
  const canPublish = userRoles.some((r: string) => ["ADMIN", "SUPER_ADMIN", "FACULTY", "STAFF"].includes(r));

  const images = (prisma as any).image
    ? await (prisma as any).image.findMany({
        where: {
          approvalStatus: "APPROVED",
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          },
          category: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold serif-text text-primary mb-4 flex items-center gap-3">
            <ImageIcon className="h-10 w-10" />
            Catalyst Gallery
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Visual stories captured by the SUNY Old Westbury community.
          </p>
        </div>
        {canPublish && (
          <Link
            href="/publish?type=image"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
          >
            Add Image
          </Link>
        )}
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-gray-50">
          <p className="text-gray-500 italic">No images in the gallery yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image: any) => (
            <div 
              key={image.id} 
              className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <Link href={`/images/${image.slug}`} className="block flex-1">
                <div className="aspect-square w-full overflow-hidden bg-gray-100">
                   <img 
                    src={image.url} 
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <h3 className="font-bold text-lg line-clamp-1">{image.title}</h3>
                  <p className="text-xs text-white/80 mb-2">By {image.author.firstName} {image.author.lastName}</p>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4 fill-primary text-primary" />
                      {image._count.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 fill-white" />
                      {image._count.comments}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                  <ContentActions 
                    contentId={image.id}
                    authorId={image.authorId}
                    contentType="Image"
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
