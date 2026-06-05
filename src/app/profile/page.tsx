import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UserTabs from "@/components/admin/UserTabs";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: { profile: true }
  });

  const allUsers = user?.role === "ADMIN" 
    ? await prisma.user.findMany({ orderBy: { role: 'asc' } })
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p className="mt-4">
          <a href={`/profile/${user?.id}`} className="text-primary hover:underline">View Public Profile</a>
        </p>
      </div>

      {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Admin Management Dashboard</h2>
          <UserTabs initialUsers={allUsers} currentUserRole={user.role} />
        </div>
      )}
    </div>
  );
}
