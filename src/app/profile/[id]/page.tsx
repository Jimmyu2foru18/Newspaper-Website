import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { 
        profile: true,
        articles: { where: { published: true } },
        videos: { where: { published: true } },
        papers: { where: { published: true } },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwner = session?.user && (session.user as any).id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow mb-8 flex items-center gap-6">
        {user.profile?.avatarUrl && (
            <img src={user.profile.avatarUrl} alt={user.name || "Profile"} className="w-24 h-24 rounded-full object-cover" />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-600">Role: {user.role}</p>
          {user.profile?.bio && <p className="mt-2 text-gray-700">{user.profile.bio}</p>}
        </div>
        {isOwner && (
          <div className="flex flex-col gap-2">
            <Link href="/profile/edit" className="bg-primary text-white px-4 py-2 rounded-md">Edit Profile</Link>
            <Link href="/publish" className="bg-primary/10 text-primary px-4 py-2 rounded-md">Create Post</Link>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.articles.map(article => (
            <div key={article.id} className="border p-4 rounded-lg">
                <span className="text-xs text-primary font-bold">ARTICLE</span>
                <h3 className="font-bold text-lg">{article.title}</h3>
                <Link href={`/news/${article.slug}`} className="text-primary hover:underline text-sm mt-2 block">Read more</Link>
            </div>
        ))}
        {user.videos.map(video => (
            <div key={video.id} className="border p-4 rounded-lg">
                <span className="text-xs text-primary font-bold">VIDEO</span>
                <h3 className="font-bold text-lg">{video.title}</h3>
                <a href={video.url} target="_blank" className="text-primary hover:underline text-sm mt-2 block">Watch</a>
            </div>
        ))}
        {user.papers.map(paper => (
            <div key={paper.id} className="border p-4 rounded-lg">
                <span className="text-xs text-primary font-bold">PAPER</span>
                <h3 className="font-bold text-lg">{paper.title}</h3>
                <Link href={`/journals/${paper.slug}`} className="text-primary hover:underline text-sm mt-2 block">Read</Link>
            </div>
        ))}
      </div>
    </div>
  );
}
