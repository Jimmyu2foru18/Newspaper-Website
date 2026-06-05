"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { MessageSquare, Reply, User as UserIcon, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  isGuest: boolean;
  guestName: string | null;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  } | null;
  replies?: Comment[];
}

interface CommentSectionProps {
  articleId?: string;
  videoId?: string;
  paperId?: string;
}

export function CommentSection({ articleId, videoId, paperId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const fetchComments = async () => {
    let url = "/api/comments?";
    if (articleId) url += `articleId=${articleId}`;
    if (videoId) url += `videoId=${videoId}`;
    if (paperId) url += `paperId=${paperId}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId, videoId, paperId]);

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          articleId,
          videoId,
          paperId,
          parentId,
          isAnonymous: isAnonymous || !session,
        }),
      });

      if (res.ok) {
        setContent("");
        setReplyTo(null);
        fetchComments();
      }
    } catch (err) {
      console.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={cn("flex gap-4 py-4", isReply ? "ml-12 border-l pl-4" : "border-b last:border-0")}>
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
        <UserIcon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm text-gray-900">
            {comment.isGuest ? comment.guestName : comment.user?.name}
          </span>
          {comment.isGuest && (
            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">GUEST</span>
          )}
          <span className="text-xs text-gray-400">
            {format(new Date(comment.createdAt), "MMM d, h:mm a")}
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
          {comment.content}
        </p>
        <div className="flex items-center gap-4">
          {!isReply && (
            <button 
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
            >
              <Reply className="h-3 w-3" />
              Reply
            </button>
          )}
          <button className="text-xs font-bold text-gray-400 flex items-center gap-1 hover:text-red-500 transition-colors">
            <ShieldAlert className="h-3 w-3" />
            Report
          </button>
        </div>

        {replyTo === comment.id && (
          <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-4">
            <textarea
              className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Write a reply..."
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="mt-2 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setReplyTo(null)}
                className="px-4 py-1.5 text-xs font-bold border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
              >
                Post Reply
              </button>
            </div>
          </form>
        )}

        {comment.replies && comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold serif-text">Community Discussion</h2>
      </div>

      <div className="bg-white border rounded-xl p-6 mb-12 shadow-sm">
        <form onSubmit={(e) => handleSubmit(e, null)}>
          <textarea
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px]"
            placeholder={session ? "Join the conversation..." : "Post as a guest owl..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="mt-4 flex items-center justify-between">
            {session ? (
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                Post anonymously
              </label>
            ) : (
              <p className="text-xs text-gray-500">
                You are posting as a guest. A random username will be generated.
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-400 italic">
            No comments yet. Start the conversation! 🐾
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
