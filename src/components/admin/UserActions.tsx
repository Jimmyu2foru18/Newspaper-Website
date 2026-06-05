"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deleteUser = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        disabled={loading}
        onClick={deleteUser}
        className="text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        Delete
      </button>
      {/* Edit implementation will follow */}
    </div>
  );
}
