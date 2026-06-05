"use client";

import { useState } from "react";

export default function FileUpload({ onUpload }: { onUpload: (path: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onUpload(data.path);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <input
      type="file"
      onChange={handleFileChange}
      disabled={loading}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
    />
  );
}
