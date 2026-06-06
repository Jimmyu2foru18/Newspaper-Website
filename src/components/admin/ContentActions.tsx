"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit } from "lucide-react";
import { canManageContent, ROLE_HIERARCHY, getHighestRole } from "@/lib/permissions";
import Link from "next/link";

interface ContentActionsProps {
  contentId: string;
  authorId: string;
  contentType: "Article" | "Video" | "ResearchPaper" | "Image";
  currentUserId: string;
  currentUserRoles: string[];
  slug?: string;
}

export default function ContentActions({
  contentId,
  authorId,
  contentType,
  currentUserId,
  currentUserRoles = [], // Default to empty array
  slug,
}: ContentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // If not logged in, roles will be empty, level will be 0 (GUEST)
  const highest = getHighestRole(currentUserRoles);
  const level = ROLE_HIERARCHY[highest] || 0;

  // Only allow STAFF and above to see these actions
  if (!currentUserId || level < ROLE_HIERARCHY.STAFF) return null;

  const canEdit = canManageContent(
    { id: currentUserId, roles: currentUserRoles },
    { authorId },
    "update"
  );
  const canDelete = canManageContent(
    { id: currentUserId, roles: currentUserRoles },
    { authorId },
    "delete"
  );

  if (!canEdit && !canDelete) return null;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    setLoading(true);
    const apiPath = contentType === "ResearchPaper" ? "papers" : `${contentType.toLowerCase()}s`;
    
    try {
      const res = await fetch(`/api/${apiPath}/${contentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete content");
      }
    } catch (err) {
      alert("Error deleting content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      {canEdit && (
        <Link 
          href={`/publish?type=${contentType.toLowerCase()}&id=${contentId}`} 
          className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50"
        >
          <Edit className="h-4 w-4" />
        </Link>
      )}
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
