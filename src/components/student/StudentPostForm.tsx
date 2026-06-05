"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "../ui/FileUpload";

export default function StudentPostForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/faculty")
      .then((res) => res.json())
      .then((data) => setFaculty(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/student-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, facultyId, fileUrl }),
      });

      if (res.ok) {
        setContent("");
        setFacultyId("");
        setFileUrl("");
        router.refresh();
        alert("Post submitted to faculty!");
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
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Attachment (Optional: PDF, DOCX, PPTX)
        </label>
        <FileUpload onUpload={setFileUrl} />
        {fileUrl && <p className="text-xs text-primary">File uploaded</p>}
      </div>
      <select
        value={facultyId}
        onChange={(e) => setFacultyId(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
        required
      >
        <option value="">Select Faculty to Review</option>
        {faculty.map((f) => (
          <option key={f.id} value={f.id}>
            {f.firstName} {f.lastName}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading || !facultyId}
        className="bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit to Faculty"}
      </button>
    </form>
  );
}
