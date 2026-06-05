"use client";

import { useState } from "react";
import { Role } from "@prisma/client";
import UserActions from "@/components/admin/UserActions";

export default function UserTabs({ initialUsers }: { initialUsers: any[] }) {
  const roles = Object.values(Role);
  const [activeRole, setActiveRole] = useState<Role>(roles[0]);

  return (
    <div>
      <div className="flex border-b mb-6 overflow-x-auto">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-6 py-3 font-medium capitalize ${
              activeRole === role
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {role.toLowerCase()}s
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 capitalize">{activeRole} Management</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers
              .filter((u) => u.role === activeRole)
              .map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <UserActions userId={user.id} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
