import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UserTabs from "@/components/admin/UserTabs";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  // Basic access control: Only Admins
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { role: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Management Dashboard</h1>
      <UserTabs initialUsers={users} />
    </div>
  );
}
