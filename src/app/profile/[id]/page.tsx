import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { profile: true },
  });

  if (!user) {
    notFound();
  }

  // Only show public fields
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p><strong>Role:</strong> {user.role}</p>
        {user.profile && (
          <div className="mt-4">
            <p><strong>Bio:</strong></p>
            <p className="text-gray-700">{user.profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
