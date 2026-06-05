import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { CommentSection } from "@/components/engagement/CommentSection";
import { User as UserIcon, Calendar } from "lucide-react";

interface VideoPageProps {
  params: {
    slug: string;
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = params;

  const video = await prisma.video.findUnique({
    where: { slug },
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
  });

  if (!video) {
    notFound();
  }

  // Simple YouTube/Vimeo embed logic
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  const embedUrl = getEmbedUrl(video.url);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl mb-8">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                {video.category.name}
              </span>
            </div>
            <h1 className="text-3xl font-bold serif-text text-gray-900 mb-6">
              {video.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserIcon className="h-4 w-4" />
                </div>
                <span className="font-medium text-gray-900">{video.author.firstName} {video.author.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(video.createdAt), "MMMM d, yyyy")}</span>
              </div>
            </div>
            <div className="prose prose-primary max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {video.description || "No description provided for this video."}
              </p>
            </div>
          </div>

          <CommentSection videoId={video.id} />
        </div>

        <div className="lg:col-span-1">
          {/* Related content or sidebar could go here */}
          <div className="p-6 bg-gray-50 rounded-xl border">
            <h3 className="font-bold text-lg serif-text mb-4 text-primary">Catalyst Media</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Explore more student-led documentaries and reports in our video library.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
