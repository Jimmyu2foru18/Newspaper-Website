"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

export default function PublishPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [publishType, setPublishType] = useState<"article" | "video" | "paper">("article");
  
  // Common state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Article state
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");

  // Video state
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [description, setDescription] = useState("");

  // Paper state
  const [abstract, setAbstract] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [citation, setCitation] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("type");
    if (type === "video") setPublishType("video");
    if (type === "paper") setPublishType("paper");

    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length > 0) setCategoryId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (publishType === "article") {
      if (!title || !content || !categoryId) {
        setError("Please fill in all required fields.");
        return;
      }
    } else if (publishType === "video") {
      if (!title || !videoUrl || !categoryId) {
        setError("Please fill in all required fields.");
        return;
      }
    } else {
      if (!title || !abstract || !categoryId) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      let endpoint = "/api/articles";
      if (publishType === "video") endpoint = "/api/videos";
      if (publishType === "paper") endpoint = "/api/papers";

      let body: any = { title, categoryId };
      if (publishType === "article") body.content = content;
      if (publishType === "video") {
        body.description = description;
        body.url = videoUrl;
        body.thumbnailUrl = thumbnailUrl;
      }
      if (publishType === "paper") {
        body.abstract = abstract;
        body.content = content;
        body.pdfUrl = pdfUrl;
        body.citation = citation;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const result = await res.json();
        if (publishType === "article") router.push(`/news/${result.slug}`);
        else if (publishType === "video") router.push("/videos");
        else router.push("/journals");
      } else {
        const data = await res.text();
        setError(data || `Failed to publish ${publishType}.`);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold serif-text text-primary">
          {publishType === "article" && "Create New Article"}
          {publishType === "video" && "Add New Video"}
          {publishType === "paper" && "Submit Research Paper"}
        </h1>
        <p className="text-gray-600 mt-2">Share your content with the Old Westbury community.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b overflow-x-auto">
        <button
          onClick={() => setPublishType("article")}
          className={cn(
            "px-6 py-2 font-medium transition-colors border-b-2 whitespace-nowrap",
            publishType === "article" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          News Article
        </button>
        <button
          onClick={() => setPublishType("video")}
          className={cn(
            "px-6 py-2 font-medium transition-colors border-b-2 whitespace-nowrap",
            publishType === "video" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Video
        </button>
        <button
          onClick={() => setPublishType("paper")}
          className={cn(
            "px-6 py-2 font-medium transition-colors border-b-2 whitespace-nowrap",
            publishType === "paper" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Research Paper
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-semibold text-gray-700">
            {publishType === "paper" ? "Paper Title" : publishType === "article" ? "Article Title" : "Video Title"}
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter title..."
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-bold serif-text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {publishType === "article" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Featured Image
              </label>
              {featuredImage && <img src={featuredImage} alt="Featured" className="w-full h-48 object-cover rounded-md mb-2" />}
              <FileUpload onUpload={setFeaturedImage} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Content
              </label>
              <RichTextEditor 
                content={content} 
                onChange={setContent} 
              />
            </div>
          </div>
        )}

        {publishType === "video" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="videoUrl" className="text-sm font-semibold text-gray-700">
                Video URL (YouTube, Vimeo, etc.)
              </label>
              <input
                id="videoUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Thumbnail
              </label>
              {thumbnailUrl && <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-48 object-cover rounded-md mb-2" />}
              <FileUpload onUpload={setThumbnailUrl} />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Briefly describe this video..."
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {publishType === "paper" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="abstract" className="text-sm font-semibold text-gray-700">
                Abstract
              </label>
              <textarea
                id="abstract"
                rows={6}
                placeholder="Provide a summary of your research..."
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  PDF File
                </label>
                {pdfUrl && <p className="text-sm text-primary mb-2">Uploaded: {pdfUrl}</p>}
                <FileUpload onUpload={setPdfUrl} />
              </div>
              <div className="space-y-2">
                <label htmlFor="citation" className="text-sm font-semibold text-gray-700">
                  Preferred Citation
                </label>
                <input
                  id="citation"
                  type="text"
                  placeholder="e.g., APA, MLA format..."
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Full Text Content (Optional)
              </label>
              <RichTextEditor 
                content={content} 
                onChange={setContent} 
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-md border hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "Publishing..." : `Publish ${publishType === "article" ? "Article" : publishType === "video" ? "Video" : "Paper"}`}
          </button>
        </div>
      </form>
    </div>
  );
}
