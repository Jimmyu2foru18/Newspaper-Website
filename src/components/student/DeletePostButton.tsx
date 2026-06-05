"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/student-posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      alert("Error deleting post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
