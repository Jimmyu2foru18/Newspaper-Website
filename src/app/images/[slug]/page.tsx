import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { LikeButton } from "@/components/engagement/LikeButton";
import { CommentSection } from "@/components/engagement/CommentSection";
import { ChevronLeft, User as UserIcon, Calendar, Tag } from "lucide-react";
import Link from "next/link";

export default async function ImageDetailPage({ params }: { params: { slug: string } }) {
  const image = (prisma as any).image 
    ? await (prisma as any).image.findUnique({
        where: { slug: params.slug },
        include: {
          author: true,
          category: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            }
          }
        }
      })
    : null;

  if (!image) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <Link 
        href="/images" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary mb-8 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Image */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full h-auto object-contain max-h-[80vh]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold serif-text text-primary">{image.title}</h1>
            <LikeButton imageId={image.id} initialCount={image._count.likes} />
          </div>

          <div className="prose max-w-none text-gray-700">
            {image.description ? (
                <p className="text-lg leading-relaxed">{image.description}</p>
            ) : (
                <p className="italic text-gray-400">No description provided.</p>
            )}
          </div>

          <CommentSection imageId={image.id} />
        </div>

        {/* Right: Sidebar / Meta */}
        <div className="space-y-8">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-gray-400">Captured By</h3>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                        <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{image.author.firstName} {image.author.lastName}</p>
                        <p className="text-sm text-gray-500">Catalyst Contributor</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Published on {format(new Date(image.createdAt), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary bg-primary/5 px-2 py-0.5 rounded">{image.category.name}</span>
                </div>
            </div>

            {/* Recommendations or similar could go here */}
        </div>
      </div>
    </div>
  );
}
