"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "../ui/FileUpload";

export default function ProfileEditForm({ user }: { user: any }) {
  const router = useRouter();
  const [bio, setBio] = useState(user.profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.profile?.avatarUrl || "");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (newPassword && newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "New passwords do not match" });
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, avatarUrl, currentPassword, newPassword }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
            router.push("/profile");
            router.refresh();
        }, 1500);
      } else {
        const errorText = await res.text();
        setMessage({ type: "error", text: errorText || "Failed to update profile" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message.text && (
          <div className={`p-4 rounded-md text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message.text}
          </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b pb-2">Public Profile</h3>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
            <div className="flex items-center gap-4">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border" />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border">
                        No Image
                    </div>
                )}
                <FileUpload onUpload={setAvatarUrl} />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b pb-2">Security</h3>
        <p className="text-sm text-gray-500 italic">Leave password fields blank if you don't want to change it.</p>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Enter current password to verify"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Min. 8 characters"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
            </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        >
            Cancel
        </button>
        <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-white px-8 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
        >
            {loading ? "Saving Changes..." : "Save All Changes"}
        </button>
      </div>
    </form>
  );
}
