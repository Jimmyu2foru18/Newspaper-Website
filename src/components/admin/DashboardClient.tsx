"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, UserPlus, UserMinus } from "lucide-react";

export default function DashboardClient({ pendingContent, studentSubmissions, reports, staff }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleModerate = async (type: string, id: string, action: string) => {
    let feedback = null;
    if (type === "studentPost") {
        feedback = prompt("Enter feedback for the student (optional):");
    }
    
    setLoading(true);
    await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, action, feedback })
    });
    setLoading(false);
    router.refresh();
  };

  const handleResolveReport = async (reportId: string) => {
    setLoading(true);
    await fetch(`/api/admin/reports/${reportId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  const handleMonitor = async (staffId: string, action: string) => {
    setLoading(true);
    await fetch("/api/admin/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId, action })
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold serif-text text-primary mb-12">Moderation & Editorial Dashboard</h1>
        
        {/* Approval Queue */}
        <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Pending Content</h2>
            <div className="grid gap-4">
                {pendingContent.map((item: any) => (
                    <div key={item.id} className="p-6 border rounded-xl bg-white shadow-sm flex items-center justify-between">
                        <div>
                            <p className="font-bold">{item.title}</p>
                            <p className="text-sm text-gray-500">By {item.author.firstName} {item.author.lastName} ({item.type})</p>
                        </div>
                        <div className="flex gap-2">
                             <button disabled={loading} onClick={() => handleModerate(item.type, item.id, "approve")} className="p-2 text-green-600 hover:bg-green-50 rounded-full"><CheckCircle /></button>
                             <button disabled={loading} onClick={() => handleModerate(item.type, item.id, "reject")} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><XCircle /></button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Student Submissions */}
        <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Student Submissions</h2>
            <div className="grid gap-4">
                {studentSubmissions.map((sub: any) => (
                    <div key={sub.id} className="p-6 border rounded-xl bg-white shadow-sm flex items-center justify-between">
                        <div>
                            <p className="font-bold mb-2">From: {sub.author.firstName} {sub.author.lastName}</p>
                            <p className="text-gray-700 mb-2">{sub.content}</p>
                            {sub.fileUrl && sub.fileUrl.length > 0 && (
                                <a href={sub.fileUrl} target="_blank" className="text-primary font-bold hover:underline text-sm">
                                    View Attachment
                                </a>
                            )}
                        </div>
                        <div className="flex gap-2">
                             <button disabled={loading} onClick={() => handleModerate("studentPost", sub.id, "approve")} className="p-2 text-green-600 hover:bg-green-50 rounded-full"><CheckCircle /></button>
                             <button disabled={loading} onClick={() => handleModerate("studentPost", sub.id, "reject")} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><XCircle /></button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Reported Comments */}
        <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Reported Comments</h2>
            <div className="grid gap-4">
                {reports.map((report: any) => (
                    <div key={report.id} className="p-6 border rounded-xl bg-white shadow-sm flex items-center justify-between">
                        <div>
                            <p className="font-bold mb-1">Comment: {report.comment.content}</p>
                            <p className="text-sm text-gray-500">Reason: {report.reason}</p>
                        </div>
                        <div className="flex gap-2">
                            <button disabled={loading} onClick={() => handleModerate("comment", report.commentId, "reject")} className="text-red-600 font-bold hover:underline text-sm">
                                Delete Comment
                            </button>
                            <button disabled={loading} onClick={() => handleResolveReport(report.id)} className="text-gray-500 font-bold hover:underline text-sm">
                                Ignore
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Staff Monitoring */}
        <section>
            <h2 className="text-2xl font-bold mb-6">Staff Monitoring</h2>
            <div className="grid gap-4">
                {staff.map((member: any) => (
                    <div key={member.id} className="p-4 border rounded-xl flex items-center justify-between">
                        <span>{member.firstName} {member.lastName}</span>
                        <div className="flex gap-2">
                            <button disabled={loading} onClick={() => handleMonitor(member.id, "assign")} className="flex items-center gap-2 text-sm text-primary hover:underline">
                                <UserPlus className="h-4 w-4" /> Monitor
                            </button>
                            <button disabled={loading} onClick={() => handleMonitor(member.id, "remove")} className="flex items-center gap-2 text-sm text-red-600 hover:underline">
                                <UserMinus className="h-4 w-4" /> Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
}
