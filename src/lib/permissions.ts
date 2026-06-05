export const ROLE_HIERARCHY: Record<string, number> = {
  GUEST: 0,
  STUDENT: 1,
  STAFF: 2,
  FACULTY: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

export const hasRole = (userRoles: string[], roleName: string): boolean => {
  return userRoles.includes(roleName);
};

export const getHighestRole = (roles: string[]): string => {
  return roles.reduce((highest, current) => {
    return (ROLE_HIERARCHY[current] || 0) > (ROLE_HIERARCHY[highest] || 0) ? current : highest;
  }, "GUEST");
};

export const canManageUser = (
  actor: { id: string; roles: string[] },
  target: { id: string; roles: string[] },
  action: "create" | "update" | "delete"
): boolean => {
  const actorHighest = getHighestRole(actor.roles);
  const targetHighest = getHighestRole(target.roles);

  const actorLevel = ROLE_HIERARCHY[actorHighest] || 0;
  const targetLevel = ROLE_HIERARCHY[targetHighest] || 0;

  // Super Admin can manage everyone except deleting self or other Super Admins
  if (actorHighest === "SUPER_ADMIN") {
    if (action === "delete") {
      if (actor.id === target.id) return false;
      if (targetHighest === "SUPER_ADMIN") return false;
    }
    return true;
  }

  // General rule: You can manage users strictly below your level
  if (actorLevel > targetLevel) {
    // Admins can manage Faculty, Staff, Students
    if (actorHighest === "ADMIN") return targetLevel <= ROLE_HIERARCHY.FACULTY;
    // Faculty can manage Staff and Students
    if (actorHighest === "FACULTY") return targetLevel <= ROLE_HIERARCHY.STAFF;
  }

  return false;
};

export const canCreateContent = (
  actorRoles: string[],
  contentType: "Article" | "Video" | "ResearchPaper" | "StudentPost" | "Image"
): boolean => {
  const highest = getHighestRole(actorRoles);
  const level = ROLE_HIERARCHY[highest] || 0;

  if (level >= ROLE_HIERARCHY.FACULTY) return true; // Faculty and above can create anything
  if (highest === "STAFF") return contentType !== "ResearchPaper";
  if (highest === "STUDENT") return contentType === "StudentPost";
  
  return false;
};

export const canApproveContent = (actorRoles: string[]): boolean => {
  const highest = getHighestRole(actorRoles);
  const level = ROLE_HIERARCHY[highest] || 0;
  return level >= ROLE_HIERARCHY.FACULTY;
};

export const canManageContent = (
  actor: { id: string; roles: string[] },
  content: { authorId: string; authorRoles?: string[] },
  action: "create" | "update" | "delete"
): boolean => {
  const highest = getHighestRole(actor.roles);
  const level = ROLE_HIERARCHY[highest] || 0;

  // Super Admin, Admin, and Faculty can manage (edit/delete) everything
  if (level >= ROLE_HIERARCHY.FACULTY) return true;

  // Staff and Students can only manage their own content
  if (level >= ROLE_HIERARCHY.STUDENT) {
    return content.authorId === actor.id;
  }
  
  return false;
};
