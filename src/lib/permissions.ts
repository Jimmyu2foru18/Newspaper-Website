import { Role } from "@prisma/client";

export const canManageUser = (actorRole: Role, targetRole: Role): boolean => {
  if (actorRole === Role.SUPER_ADMIN) return true;
  if (actorRole === Role.ADMIN) return targetRole !== Role.ADMIN && targetRole !== Role.SUPER_ADMIN;
  if (actorRole === Role.FACULTY) return targetRole === Role.STAFF || targetRole === Role.STUDENT;
  return false;
};

export const canCreateContent = (
  actor: { role: Role },
  contentType: "Article" | "Video" | "ResearchPaper" | "StudentPost"
): boolean => {
  if (actor.role === Role.SUPER_ADMIN || actor.role === Role.ADMIN || actor.role === Role.FACULTY) return true;
  if (actor.role === Role.STAFF) return contentType !== "ResearchPaper";
  if (actor.role === Role.STUDENT) return contentType === "StudentPost";
  
  return false;
};

export const canManageContent = (
  actor: { id: string; role: Role },
  content: { authorId: string },
  action: "create" | "update" | "delete"
): boolean => {
  if (actor.role === Role.SUPER_ADMIN) return true;
  if (actor.role === Role.ADMIN && content.authorId !== "ADMIN" /* TODO: fix content author check */) return true;
  if (actor.role === Role.FACULTY) return true; // Assuming Faculty can manage all academic content
  if (actor.role === Role.STAFF) return content.authorId === actor.id;
  if (actor.role === Role.STUDENT) return content.authorId === actor.id;
  
  return false;
};
