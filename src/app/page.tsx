import Link from "next/link";
import { ArrowRight, Newspaper, Video, GraduationCap, Play } from "lucide-react";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export default async function Home() {
  const latestArticles = await prisma.article.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const latestVideos = await prisma.video.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full bg-primary overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-[url('https://www.oldwestbury.edu/sites/default/files/styles/hero_image/public/2021-08/campus-shot.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 serif-text leading-tight">
              Amplifying the Voices of Old Westbury
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 font-light max-w-2xl">
              The Catalyst serves as the primary digital hub for investigative journalism, scholarly research, and student-produced media at SUNY Old Westbury.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/news"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 py-3 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                View News
              </Link>
              <Link
                href="/publish"
                className="inline-flex h-12 items-center justify-center rounded-md border-2 border-white px-8 py-3 text-base font-bold text-white transition-all hover:bg-white/10"
              >
                Submit Content
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold serif-text text-primary flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-primary" />
            Recent Publications
          </h2>
          <Link href="/news" className="text-primary font-bold hover:underline flex items-center gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestArticles.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`} className="group">
              <div className="aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                {article.featuredImage ? (
                  <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/10 font-bold text-3xl serif-text">Catalyst</div>
                )}
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">{article.category.name}</span>
              <h3 className="text-xl font-bold serif-text mt-2 mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{article.excerpt || "Read more about this story..."}</p>
            </Link>
          ))}
          {latestArticles.length === 0 && (
            <div className="col-span-3 py-12 text-center border-2 border-dashed rounded-xl text-gray-400 italic">
              New stories are on their way! 🐾
            </div>
          )}
        </div>
      </section>

      {/* Latest Videos Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold serif-text text-primary flex items-center gap-3">
              <Video className="h-8 w-8 text-primary" />
              Multimedia Gallery
            </h2>
            <Link href="/videos" className="text-primary font-bold hover:underline flex items-center gap-2">
              Video Library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestVideos.map((video) => (
              <Link key={video.id} href={`/videos/${video.slug}`} className="group relative">
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-lg relative">
                  {video.thumbnailUrl && <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform" />}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="h-7 w-7 fill-current" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-bold serif-text group-hover:text-primary transition-colors">{video.title}</h3>
                <span className="text-xs text-gray-500">{format(new Date(video.createdAt), "MMMM d, yyyy")}</span>
              </Link>
            ))}
            {latestVideos.length === 0 && (
              <div className="col-span-3 py-12 text-center text-gray-400 italic">
                The video library is getting ready. Check back soon! 🎥
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Academic/Mascot Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="bg-primary rounded-3xl p-8 md:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 md:w-2/3">
            <h2 className="text-4xl font-bold serif-text mb-6">Scholarly Excellence</h2>
            <p className="text-xl mb-10 text-white/80 font-light leading-relaxed">
              SUNY Old Westbury is a hub of research and academic discovery. The Catalyst provides a platform for students to publish their journals, research papers, and scholarly works.
            </p>
            <div className="flex gap-4">
              <Link href="/journals" className="bg-white text-primary px-8 py-3 rounded-md font-bold hover:bg-white/90 transition-colors">
                Browse Research
              </Link>
            </div>
          </div>
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="text-[120px] mb-4 animate-bounce">🐾</div>
            <p className="text-2xl italic serif-text">"Owen's Research Corner"</p>
          </div>
        </div>
      </section>
    </div>
  );
}
