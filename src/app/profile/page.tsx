import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UserTabs from "@/components/admin/UserTabs";
import CommentModeration from "@/components/admin/CommentModeration";
import StudentPostForm from "@/components/student/StudentPostForm";
import DeletePostButton from "@/components/student/DeletePostButton";
import AddUserForm from "@/components/admin/AddUserForm";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: { 
        profile: true, 
        roles: { include: { role: true } },
        studentPosts: { orderBy: { createdAt: "desc" } },
        articles: { where: { approvalStatus: "APPROVED" }, orderBy: { createdAt: "desc" } },
        videos: { where: { approvalStatus: "APPROVED" }, orderBy: { createdAt: "desc" } },
        papers: { where: { approvalStatus: "APPROVED" }, orderBy: { createdAt: "desc" } },
        images: { where: { approvalStatus: "APPROVED" }, orderBy: { createdAt: "desc" } }
    }
  });
  
  const userRoles = user?.roles.map(r => r.role.name) || [];
  const currentUserId = user?.id as string;
  const submissions = user?.studentPosts || [];

  const canSeeDashboard = userRoles.includes("ADMIN") || userRoles.includes("SUPER_ADMIN") || userRoles.includes("FACULTY");

  const allUsers = canSeeDashboard
    ? await prisma.user.findMany({ include: { roles: { include: { role: true } } } })
    : [];
    
  let allUsersWithRoles = allUsers.map(u => ({
    ...u,
    roles: u.roles.map(r => r.role.name)
  }));

  // Filter users based on what the actor can manage/see
  if (userRoles.includes("FACULTY") && !userRoles.includes("ADMIN") && !userRoles.includes("SUPER_ADMIN")) {
    allUsersWithRoles = allUsersWithRoles.filter(u => 
        u.roles.includes("STAFF") || u.roles.includes("STUDENT")
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        {user?.profile?.avatarUrl && (
            <img src={user.profile.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="w-24 h-24 rounded-full object-cover mb-4" />
        )}
        <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Roles:</strong> {userRoles.join(", ")}</p>
        {user?.profile?.bio && <p className="mt-2 text-gray-700"><strong>Bio:</strong> {user.profile.bio}</p>}
        <p className="mt-4">
          <Link href="/profile/edit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">Edit Profile</Link>
        </p>
      </div>

      {/* Published Content Section */}
      <h2 className="text-2xl font-bold mb-4">My Published Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {user?.articles.map(article => (
            <div key={article.id} className="border p-4 rounded-lg bg-white shadow-sm">
                <span className="text-xs text-primary font-bold">ARTICLE</span>
                <h3 className="font-bold text-lg">{article.title}</h3>
                <p className="text-sm text-gray-500">By {user.firstName} {user.lastName}</p>
                <Link href={`/news/${article.slug}`} className="text-primary hover:underline text-sm mt-2 block">Read more</Link>
            </div>
        ))}
        {user?.videos.map(video => (
            <div key={video.id} className="border p-4 rounded-lg bg-white shadow-sm">
                <span className="text-xs text-primary font-bold">VIDEO</span>
                <h3 className="font-bold text-lg">{video.title}</h3>
                <p className="text-sm text-gray-500">By {user.firstName} {user.lastName}</p>
                <a href={video.url} target="_blank" className="text-primary hover:underline text-sm mt-2 block">Watch</a>
            </div>
        ))}
        {user?.papers.map(paper => (
            <div key={paper.id} className="border p-4 rounded-lg bg-white shadow-sm">
                <span className="text-xs text-primary font-bold">PAPER</span>
                <h3 className="font-bold text-lg">{paper.title}</h3>
                <p className="text-sm text-gray-500">By {user.firstName} {user.lastName}</p>
                <Link href={`/journals/${paper.slug}`} className="text-primary hover:underline text-sm mt-2 block">Read</Link>
            </div>
        ))}
        {user?.images.map(image => (
            <div key={image.id} className="border p-4 rounded-lg bg-white shadow-sm">
                <span className="text-xs text-primary font-bold">IMAGE</span>
                <h3 className="font-bold text-lg">{image.title}</h3>
                <p className="text-sm text-gray-500">By {user.firstName} {user.lastName}</p>
                <Link href={`/images/${image.slug}`} className="text-primary hover:underline text-sm mt-2 block">View</Link>
            </div>
        ))}
      </div>

      {userRoles.includes("STUDENT") && (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Submit Post for review</h2>
            <StudentPostForm />
            
            {submissions.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">My Submissions</h3>
                    <div className="space-y-4">
                        {submissions.map(sub => (
                            <div key={sub.id} className="p-4 border rounded-lg bg-white shadow-sm flex items-start justify-between">
                                <div>
                                    <p className="font-medium">{sub.content}</p>
                                    <p className={`text-sm font-bold mt-2 ${sub.status === "APPROVED" ? "text-green-600" : sub.status === "REJECTED" ? "text-red-600" : "text-yellow-600"}`}>
                                        Status: {sub.status}
                                    </p>
                                    {sub.feedback && <p className="text-sm text-gray-600 mt-1">Feedback: {sub.feedback}</p>}
                                </div>
                                <DeletePostButton postId={sub.id} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}

      {canSeeDashboard && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Management Dashboard</h2>
          {(userRoles.includes("SUPER_ADMIN") || userRoles.includes("ADMIN") || userRoles.includes("FACULTY")) && <AddUserForm currentUserRoles={userRoles} />}
          <UserTabs 
            initialUsers={allUsersWithRoles} 
            currentUserRoles={userRoles} 
            currentUserId={currentUserId}
          />
        </div>
      )}

      {(userRoles.includes("ADMIN") || userRoles.includes("SUPER_ADMIN") || userRoles.includes("FACULTY")) && (
        <div className="mt-8 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Moderation</h2>
            <CommentModeration />
        </div>
      )}
    </div>
  );
}
