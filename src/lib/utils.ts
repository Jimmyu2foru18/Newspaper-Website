import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import prisma from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getNextStudentId(): Promise<string> {
  const lastUser = await prisma.user.findMany({
    where: {
      id: { startsWith: "70" }
    },
    orderBy: { id: "desc" },
    take: 1
  });

  if (lastUser.length === 0) return "700000001";
  
  const lastId = parseInt(lastUser[0].id);
  return (lastId + 1).toString();
}
