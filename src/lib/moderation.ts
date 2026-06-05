import { getHighestRole, ROLE_HIERARCHY } from "./permissions";

export const canModerate = (moderatorRoles: string[], targetRoles: string[]): boolean => {
  const moderatorHighest = getHighestRole(moderatorRoles);
  const targetHighest = getHighestRole(targetRoles);

  const moderatorLevel = ROLE_HIERARCHY[moderatorHighest] || 0;
  const targetLevel = ROLE_HIERARCHY[targetHighest] || 0;

  // Admin and Super Admin can moderate anything below Admin
  if (moderatorLevel >= ROLE_HIERARCHY.ADMIN) {
    if (moderatorHighest === "SUPER_ADMIN") return true;
    return targetLevel < ROLE_HIERARCHY.ADMIN;
  }
  
  // Faculty can moderate Staff and Student
  if (moderatorHighest === "FACULTY") {
    return targetLevel < ROLE_HIERARCHY.FACULTY;
  }
  
  return false;
};

export const canApproveContent = (moderatorRoles: string[]): boolean => {
    const moderatorHighest = getHighestRole(moderatorRoles);
    const moderatorLevel = ROLE_HIERARCHY[moderatorHighest] || 0;
    return moderatorLevel >= ROLE_HIERARCHY.FACULTY;
};
