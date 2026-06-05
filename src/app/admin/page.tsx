import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import UserActions from "@/components/admin/UserActions";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  // Basic access control: Only Admins
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { role: 'asc' }
  });

  const roles = Object.values(Role);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Management Dashboard</h1>
      
      {roles.map((role) => (
        <div key={role} className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{role} Management</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role === role).map(user => (
                <tr key={user.id} className="border-t">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">
                    <UserActions userId={user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
