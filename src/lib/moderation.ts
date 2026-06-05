import { Role } from "@prisma/client";

export const canModerate = (moderatorRole: Role, targetRole: Role): boolean => {
  if (moderatorRole === Role.ADMIN) return true;
  
  if (moderatorRole === Role.FACULTY) {
    // Faculty oversees Staff and Students
    return [Role.STAFF, Role.STUDENT, Role.GUEST].includes(targetRole);
  }
  
  if (moderatorRole === Role.STAFF) {
    // Staff oversees Guest comments
    return targetRole === Role.GUEST;
  }
  
  return false;
};
