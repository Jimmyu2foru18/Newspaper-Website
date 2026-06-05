import Link from "next/link";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { Play } from "lucide-react";

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
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
          <h1 className="text-4xl font-bold serif-text text-primary mb-4">Video Library</h1>
          <p className="text-gray-600 max-w-2xl">
            Watch documentaries, campus reports, and original student-led video content.
          </p>
        </div>
        <Link
          href="/publish?type=video"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
        >
          Add Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-gray-50">
          <p className="text-gray-500 italic">No videos in the library yet. Be the first to add one!</p>
          <div className="text-6xl mt-4 opacity-10">🎥</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Link 
              key={video.id} 
              href={`/videos/${video.slug}`}
              className="group flex flex-col h-full border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              <div className="aspect-video w-full relative overflow-hidden bg-black">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/20 font-bold text-2xl">Catalyst Video</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                   <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white">
                      <Play className="h-6 w-6 fill-current" />
                   </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                    {video.category.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(video.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-3 serif-text group-hover:text-primary transition-colors">
                  {video.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                  {video.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200" />
                    <span className="text-xs font-medium text-gray-700">{video.author.name}</span>
                  </div>
                  <Link 
                    href={video.url} 
                    target="_blank"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Watch Now
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
