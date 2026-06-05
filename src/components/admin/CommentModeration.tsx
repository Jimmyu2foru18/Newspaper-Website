import { useState, useEffect } from "react";

export default function CommentModeration() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comments/pending") // I'll need to create this endpoint
      .then((res) => res.json())
      .then(setComments)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (commentId: string, action: "APPROVED" | "REJECTED") => {
    await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentId, action, type: "comment" }),
    });
    setComments(comments.filter((c) => c.id !== commentId));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Pending Comments</h2>
      {comments.length === 0 ? (
        <p>No pending comments.</p>
      ) : (
        <table className="w-full">
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="border-t">
                <td className="py-3">{comment.content}</td>
                <td className="py-3 flex gap-2">
                  <button onClick={() => handleAction(comment.id, "APPROVED")} className="text-green-600">Approve</button>
                  <button onClick={() => handleAction(comment.id, "REJECTED")} className="text-red-600">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
