"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search as SearchIcon, Newspaper, Video, GraduationCap, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    articles: any[];
    videos: any[];
    papers: any[];
    images: any[];
  }>({ articles: [], videos: [], papers: [], images: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        performSearch();
      } else {
        setResults({ articles: [], videos: [], papers: [], images: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const hasResults = results.articles.length > 0 || results.videos.length > 0 || results.papers.length > 0 || results.images.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* ... (existing header and search input) */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold serif-text text-primary mb-4">Search the Catalyst</h1>
        <p className="text-gray-600">Find stories, videos, and research from across the campus.</p>
      </div>

      <div className="relative mb-16">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
        <input
          type="text"
          placeholder="Type to search..."
          className="w-full pl-12 pr-4 py-4 text-xl rounded-2xl border-2 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      {query && !loading && !hasResults && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
          <p className="text-gray-500 italic text-lg">No results found for "{query}". 🐾</p>
          <p className="text-sm text-gray-400 mt-2">Try different keywords or check your spelling.</p>
        </div>
      )}

      <div className="space-y-16">
        {results.articles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold serif-text text-primary mb-6 flex items-center gap-2">
              <Newspaper className="h-6 w-6" /> News Stories
            </h2>
            <div className="grid gap-4">
              {results.articles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="block p-6 border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">{article.category.name}</span>
                  <h3 className="text-xl font-bold serif-text mt-1 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-1">{article.excerpt || "Read the full story..."}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {results.videos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold serif-text text-primary mb-6 flex items-center gap-2">
              <Video className="h-6 w-6" /> Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.videos.map((video) => (
                <Link key={video.id} href={`/videos/${video.slug}`} className="block group">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden mb-3 relative">
                    {video.thumbnailUrl && <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-80" />}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                       <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                          <SearchIcon className="h-5 w-5" />
                       </div>
                    </div>
                  </div>
                  <h3 className="font-bold serif-text group-hover:text-primary transition-colors">{video.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {results.images.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold serif-text text-primary mb-6 flex items-center gap-2">
              <ImageIcon className="h-6 w-6" /> Gallery Images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.images.map((image) => (
                <Link key={image.id} href={`/images/${image.slug}`} className="block group">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2 relative shadow-sm">
                    <img src={image.url} alt={image.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{image.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {results.papers.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold serif-text text-primary mb-6 flex items-center gap-2">
              <GraduationCap className="h-6 w-6" /> Research Papers
            </h2>
            <div className="grid gap-4">
              {results.papers.map((paper) => (
                <Link key={paper.id} href={`/journals/${paper.slug}`} className="block p-6 border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
                   <div className="flex justify-between items-start">
                     <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">{paper.category.name}</span>
                        <h3 className="text-xl font-bold serif-text mt-1 group-hover:text-primary transition-colors">{paper.title}</h3>
                        <p className="text-gray-500 text-sm mt-2 italic line-clamp-2">{paper.abstract}</p>
                     </div>
                   </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {!query && (
        <div className="text-center py-20 opacity-20">
          <div className="text-[100px] mb-4 flex justify-center">🐾</div>
          <p className="text-2xl serif-text italic font-bold">"Owen is helping you look..."</p>
        </div>
      )}
    </div>
  );
}
