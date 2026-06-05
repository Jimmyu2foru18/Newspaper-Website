export const hasRole = (roles: { role: { name: string } }[], roleName: string): boolean => {
  return roles.some(r => r.role.name === roleName);
};

export const canManageUser = (
  actor: { id: string; roles: string[] },
  target: { id: string; roles: string[] },
  action: "create" | "update" | "delete"
): boolean => {
  const actorRoles = actor.roles;
  const targetRoles = target.roles;
  const isTargetAdminOrSuper = targetRoles.includes("ADMIN") || targetRoles.includes("SUPER_ADMIN");

  // Rule 1: Super Admin can manage all, but cannot delete self or other Super Admins
  if (actorRoles.includes("SUPER_ADMIN")) {
    if (action === "delete") {
        if (actor.id === target.id) return false;
        if (targetRoles.includes("SUPER_ADMIN")) return false;
    }
    return true;
  }

  // Rule 2: Admin can manage all EXCEPT Admins and Super Admins
  if (actorRoles.includes("ADMIN")) {
    return !isTargetAdminOrSuper;
  }

  // Rule 3: Faculty can manage Staff and Students
  if (actorRoles.includes("FACULTY")) {
    return targetRoles.includes("STAFF") || targetRoles.includes("STUDENT");
  }
  
  return false;
};

export const canCreateContent = (
  actorRoles: string[],
  contentType: "Article" | "Video" | "ResearchPaper" | "StudentPost"
): boolean => {
  if (actorRoles.includes("SUPER_ADMIN") || actorRoles.includes("ADMIN") || actorRoles.includes("FACULTY")) return true;
  if (actorRoles.includes("STAFF")) return contentType !== "ResearchPaper";
  if (actorRoles.includes("STUDENT")) return contentType === "StudentPost";
  
  return false;
};

export const canManageContent = (
  actor: { id: string; roles: string[] },
  content: { authorId: string },
  action: "create" | "update" | "delete"
): boolean => {
  if (actor.roles.includes("SUPER_ADMIN")) return true;
  if (actor.roles.includes("ADMIN") && content.authorId !== "ADMIN") return true;
  if (actor.roles.includes("FACULTY")) return true;
  if (actor.roles.includes("STAFF")) return content.authorId === actor.id;
  if (actor.roles.includes("STUDENT")) return content.authorId === actor.id;
  
  return false;
};
