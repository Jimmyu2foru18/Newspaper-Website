"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ROLE_HIERARCHY, getHighestRole } from "@/lib/permissions";

export default function AddUserForm({ currentUserRoles }: { currentUserRoles: string[] }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", role: "STUDENT" });
  const [loading, setLoading] = useState(false);

  const actorHighest = getHighestRole(currentUserRoles);
  const actorLevel = ROLE_HIERARCHY[actorHighest] || 0;

  const availableRoles = Object.keys(ROLE_HIERARCHY).filter(role => {
    if (actorHighest === "SUPER_ADMIN") return true;
    return ROLE_HIERARCHY[role] < actorLevel;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setFormData({ firstName: "", lastName: "", email: "", role: "STUDENT" });
        router.refresh();
      } else {
        alert("Failed to add user");
      }
    } catch (err) {
      alert("Error adding user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 mb-8">
        <h3 className="text-lg font-bold">Add New User</h3>
        <div className="grid grid-cols-2 gap-4">
            <input placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="border p-2 rounded" required />
            <input placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="border p-2 rounded" required />
        </div>
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded" required />
        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded">
            {availableRoles.map(role => (
                <option key={role} value={role}>{role.charAt(0) + role.slice(1).toLowerCase()}</option>
            ))}
        </select>
        <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded">Add User</button>
    </form>
  );
}
