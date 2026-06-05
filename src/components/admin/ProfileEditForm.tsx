"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "../ui/FileUpload";

export default function ProfileEditForm({ user }: { user: any }) {
  const router = useRouter();
  const [bio, setBio] = useState(user.profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.profile?.avatarUrl || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, avatarUrl }),
      });
      if (res.ok) {
        router.push("/profile");
        router.refresh();
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Avatar</label>
        {avatarUrl && <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full mb-2" />}
        <FileUpload onUpload={setAvatarUrl} />
      </div>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">
        Save Profile
      </button>
    </form>
  );
}
