"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentPostForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/student-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      
      if (res.ok) {
        setContent("");
        router.refresh();
      } else {
        alert("Failed to create post");
      }
    } catch (err) {
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
        placeholder="Write something..."
        required
      />
      <button 
        type="submit" 
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
