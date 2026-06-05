"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { cn } from "@/lib/utils";
import FileUpload from "@/components/ui/FileUpload";
import { canCreateContent } from "@/lib/permissions";

interface Category {
  id: string;
  name: string;
}

export default function PublishPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const userRoles = (session?.user as any)?.roles || [];
  
  const canPublishArticle = canCreateContent(userRoles, "Article");
  const canPublishVideo = canCreateContent(userRoles, "Video");
  const canPublishPaper = canCreateContent(userRoles, "ResearchPaper");
  const canPublishImage = canCreateContent(userRoles, "Image");

  const [publishType, setPublishType] = useState<"article" | "video" | "paper" | "image">(
    canPublishArticle ? "article" : canPublishVideo ? "video" : canPublishPaper ? "paper" : "image"
  );
  
  const canPublishCurrent = (publishType === "article" && canPublishArticle) || 
                          (publishType === "video" && canPublishVideo) || 
                          (publishType === "paper" && canPublishPaper) ||
                          (publishType === "image" && canPublishImage);

  // Common state
  const [contentId, setContentId] = useState<string | null>(null);
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
    const id = searchParams.get("id");
    
    if (type) setPublishType(type as any);
    if (id) {
        setContentId(id);
        const apiPath = type === "paper" ? "papers" : `${type}s`;
        fetch(`/api/${apiPath}/${id}`)
            .then(res => res.json())
            .then(data => {
                setTitle(data.title);
                setCategoryId(data.categoryId);
                if (type === "article") {
                    setContent(data.content);
                    setFeaturedImage(data.featuredImage);
                }
                if (type === "video") {
                    setVideoUrl(data.url);
                    setThumbnailUrl(data.thumbnailUrl);
                    setDescription(data.description);
                }
                if (type === "paper") {
                    setAbstract(data.abstract);
                    setContent(data.content);
                    setPdfUrl(data.pdfUrl);
                    setFeaturedImage(data.imageUrl); 
                    setCitation(data.citation);
                }
                if (type === "image") {
                    setFeaturedImage(data.url);
                    setDescription(data.description);
                }
            });
    }

    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length > 0 && !categoryId) setCategoryId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");

    try {
      let endpoint = `/api/${publishType === "paper" ? "papers" : publishType + "s"}`;
      let method = "POST";
      
      if (contentId) {
          endpoint += `/${contentId}`;
          method = "PATCH";
      }

      let body: any = { title, categoryId };
      if (publishType === "article") {
          body.content = content;
          body.featuredImage = featuredImage;
      }
      if (publishType === "video") {
        body.description = description;
        body.url = videoUrl;
        body.thumbnailUrl = thumbnailUrl;
      }
      if (publishType === "paper") {
        body.abstract = abstract;
        body.content = content;
        body.pdfUrl = pdfUrl;
        body.imageUrl = featuredImage;
        body.citation = citation;
      }
      if (publishType === "image") {
        body.description = description;
        body.url = featuredImage;
      }

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const result = await res.json();
        if (publishType === "article") router.push(`/news/${result.slug}`);
        else if (publishType === "video") router.push("/videos");
        else if (publishType === "image") router.push("/images");
        else router.push("/journals");
      } else {
        const data = await res.text();
        setError(data || `Failed to ${method === "POST" ? "publish" : "update"} ${publishType}.`);
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
          {contentId ? "Edit" : "Create New"} {publishType === "article" && "Article"}
          {publishType === "video" && "Video"}
          {publishType === "paper" && "Research Paper"}
          {publishType === "image" && "Image"}
        </h1>
        <p className="text-gray-600 mt-2">Manage your content for the Old Westbury community.</p>
      </div>

      {/* Tabs */}
      {!contentId && (
          <div className="flex gap-4 mb-8 border-b overflow-x-auto">
            {canPublishArticle && (
              <button
                onClick={() => setPublishType("article")}
                className={cn(
                  "px-6 py-2 font-medium transition-colors border-b-2 whitespace-nowrap",
                  publishType === "article" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                News Article
              </button>
            )}
            {canPublishImage && (
              <button
                onClick={() => setPublishType("image")}
                className={cn(
                  "px-6 py-2 font-medium transition-colors border-b-2 whitespace-nowrap",
                  publishType === "image" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                Gallery Image
              </button>
            )}
            {canPublishVideo && (
              <button
                onClick={() => setPublishType("video")}
                className={cn(
                  "px-6 py-2 font-medium transition-colors border-b-2 whitespace-nowrap",
                  publishType === "video" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                Video
              </button>
            )}
            {canPublishPaper && (
              <button
                onClick={() => setPublishType("paper")}
                className={cn(
                  "px-6 py-2 font-medium transition-colors border-b-2 whitespace-nowrap",
                  publishType === "paper" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                Research Paper
              </button>
            )}
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        {canPublishCurrent ? (
          <>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                {publishType === "paper" ? "Paper Title" : publishType === "article" ? "Article Title" : publishType === "video" ? "Video Title" : "Image Title"}
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

            {publishType === "image" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Image File
                  </label>
                  {featuredImage && <img src={featuredImage} alt="Preview" className="w-full h-64 object-contain bg-gray-50 rounded-md mb-2" />}
                  <FileUpload onUpload={setFeaturedImage} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe this image..."
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    <label className="text-sm font-semibold text-gray-700">
                      Cover Image (Optional)
                    </label>
                    {featuredImage && <img src={featuredImage} alt="Cover Preview" className="w-full h-32 object-cover rounded-md mb-2" />}
                    <FileUpload onUpload={setFeaturedImage} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="citation" className="text-sm font-semibold text-gray-700">
                    Preferred Citation
                  </label>
                  <input
                    id="citation"
                    type="text"
                    placeholder="e.g., APA, MLA format..."
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={citation}
                    onChange={(e) => setCitation(e.target.value)}
                  />
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
                {loading ? (contentId ? "Updating..." : "Publishing...") : (contentId ? "Update" : "Publish")}
              </button>
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 italic">
            Select a content type you are authorized to publish.
          </div>
        )}
      </form>
    </div>
  );
}
