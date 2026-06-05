import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UserTabs from "@/components/admin/UserTabs";
import CommentModeration from "@/components/admin/CommentModeration";
import StudentPostForm from "@/components/student/StudentPostForm"; // Need to create this

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: { profile: true, roles: { include: { role: true } } }
  });
  
  const userRoles = user?.roles.map(r => r.role.name) || [];

  const allUsers = (userRoles.includes("ADMIN") || userRoles.includes("SUPER_ADMIN"))
    ? await prisma.user.findMany({ include: { roles: { include: { role: true } } } })
    : [];
    
  const allUsersWithRoles = allUsers.map(u => ({
    ...u,
    roles: u.roles.map(r => r.role.name)
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Roles:</strong> {userRoles.join(", ")}</p>
        <p className="mt-4">
          <a href={`/profile/${user?.id}`} className="text-primary hover:underline">View Public Profile</a>
        </p>
      </div>

      {userRoles.includes("STUDENT") && (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Create Post</h2>
            <StudentPostForm />
        </div>
      )}

      {(userRoles.includes("ADMIN") || userRoles.includes("SUPER_ADMIN")) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Admin Management Dashboard</h2>
          <UserTabs initialUsers={allUsersWithRoles} currentUserRoles={userRoles} />
        </div>
      )}

      {(userRoles.includes("ADMIN") || userRoles.includes("FACULTY") || userRoles.includes("STAFF")) && (
        <CommentModeration />
      )}
    </div>
  );
}
