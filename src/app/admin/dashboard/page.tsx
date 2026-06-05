import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ApprovalStatus } from "@prisma/client";
import DashboardClient from "@/components/admin/DashboardClient";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !(session.user as any).roles?.some((r: string) => ["FACULTY", "ADMIN", "SUPER_ADMIN"].includes(r))) {
    redirect("/profile");
  }

  const facultyUserId = (session.user as any).id;

  // Fetch pending content
  const pendingArticles = await prisma.article.findMany({ where: { approvalStatus: ApprovalStatus.PENDING }, include: { author: true } });
  const pendingVideos = await prisma.video.findMany({ where: { approvalStatus: ApprovalStatus.PENDING }, include: { author: true } });
  const pendingPapers = await prisma.researchPaper.findMany({ where: { approvalStatus: ApprovalStatus.PENDING }, include: { author: true } });
  const pendingImages = await prisma.image.findMany({ where: { approvalStatus: ApprovalStatus.PENDING }, include: { author: true } });

  // Fetch pending student submissions for this faculty
  const studentSubmissions = await prisma.studentPost.findMany({
    where: { 
        facultyId: facultyUserId,
        status: ApprovalStatus.PENDING 
    },
    include: { author: true }
  });

  // Fetch all reports
  const reports = await prisma.report.findMany({
    include: { comment: true }
  });

  // Fetch all staff
  const staff = await prisma.user.findMany({
    where: { roles: { some: { role: { name: "STAFF" } } } }
  });

  return (
    <DashboardClient 
        pendingContent={[
            ...pendingArticles.map(i => ({...i, type: 'article'})),
            ...pendingVideos.map(i => ({...i, type: 'video'})),
            ...pendingPapers.map(i => ({...i, type: 'paper'})),
            ...pendingImages.map(i => ({...i, type: 'image'}))
        ]}
        studentSubmissions={studentSubmissions}
        reports={reports}
        staff={staff}
    />
  );
  }

