import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileEditForm from "@/components/admin/ProfileEditForm"; // Need to create this

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: { profile: true }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <ProfileEditForm user={user} />
      </div>
    </div>
  );
}
