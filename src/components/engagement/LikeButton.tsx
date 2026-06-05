"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  imageId?: string;
  articleId?: string;
  videoId?: string;
  initialCount?: number;
  initialLiked?: boolean;
}

export function LikeButton({ imageId, articleId, videoId, initialCount = 0, initialLiked = false }: LikeButtonProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If not provided, fetch current state
    if (initialCount === 0 && !initialLiked) {
        const fetchLikeState = async () => {
            let url = `/api/likes?`;
            if (imageId) url += `imageId=${imageId}`;
            if (articleId) url += `articleId=${articleId}`;
            if (videoId) url += `videoId=${videoId}`;
            
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setCount(data.count);
                setLiked(data.userLiked);
            }
        };
        fetchLikeState();
    }
  }, [imageId, articleId, videoId]);

  const toggleLike = async () => {
    if (!session) {
      alert("Please sign in to like this content.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, articleId, videoId }),
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(prev => data.liked ? prev + 1 : prev - 1);
      }
    } catch (err) {
      console.error("Failed to toggle like");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all active:scale-95",
        liked ? "bg-primary/10 border-primary text-primary" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
      )}
    >
      <Heart className={cn("h-5 w-5 transition-colors", liked && "fill-current")} />
      <span className="font-bold">{count}</span>
    </button>
  );
}
