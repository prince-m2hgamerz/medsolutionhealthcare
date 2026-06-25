"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { createClient } from "@/lib/supabase/client";

interface AdminUser {
  id: string;
  email: string;
  role: "super_admin" | "editor" | "viewer";
}

const roleColors: Record<string, string> = {
  super_admin: "bg-aloe-10 text-ink",
  editor: "bg-pistachio-10 text-ink",
  viewer: "bg-shade-30 text-ink",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "editor" as AdminUser["role"] });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("admin_users").select("*").order("email").then(({ data }) => {
      if (data) setUsers(data as AdminUser[]);
    });
  }, []);

  const handleInvite = async () => {
    const supabase = createClient();
    await supabase.from("admin_users").insert({ email: form.email, role: form.role });
    const { data } = await supabase.from("admin_users").select("*").order("email");
    if (data) setUsers(data as AdminUser[]);
    setModalOpen(false);
    setForm({ email: "", role: "editor" });
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`Remove user ${email}?`)) return;
    const supabase = createClient();
    await supabase.from("admin_users").delete().eq("email", email);
    setUsers(users.filter((u) => u.email !== email));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-ink">Admin Users</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> <span className="hidden sm:inline">Invite User</span>
        </button>
      </div>

      <div className="bg-canvas-light rounded-lg border border-hairline-light overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-body-md">
          <thead>
            <tr className="bg-canvas-cream border-b border-hairline-light text-left">
              <th className="p-3 sm:p-4 text-caption text-shade-40 uppercase tracking-wider">Email</th>
              <th className="p-3 sm:p-4 text-caption text-shade-40 uppercase tracking-wider">Role</th>
              <th className="p-3 sm:p-4 text-caption text-shade-40 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-hairline-light hover:bg-canvas-cream/50 transition-colors">
                <td className="p-3 sm:p-4 text-ink font-medium">{u.email}</td>
                <td className="p-3 sm:p-4">
                  <span className={`px-2.5 py-0.5 rounded-pill text-micro capitalize ${roleColors[u.role] || "bg-shade-30 text-ink"}`}>
                    {u.role.replace("_", " ")}
                  </span>
                </td>
                <td className="p-3 sm:p-4">
                  <button onClick={() => handleDelete(u.email)} className="flex items-center gap-1.5 text-caption text-red-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Invite Admin User" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-caption text-shade-50 mb-1.5">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
              className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-caption text-shade-50 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser["role"] })}
              className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink"
            >
              <option value="super_admin">Super Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-hairline-light">
            <button onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button onClick={handleInvite} className="btn-primary">Send Invite</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
