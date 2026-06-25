"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { createClient } from "@/lib/supabase/client";

interface Specialty {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
}

export default function AdminSpecialtiesPage() {
  const [data, setData] = useState<Specialty[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Specialty | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", description: "", icon_url: "" });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("specialties").select("*").order("name").then(({ data: items }) => {
      if (items) setData(items as Specialty[]);
      setLoading(false);
    });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", icon_url: "" });
    setModalOpen(true);
  };

  const openEdit = (item: Specialty) => {
    setEditing(item);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      icon_url: item.icon_url || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (item: Specialty) => {
    if (!confirm(`Delete specialty "${item.name}"?`)) return;
    const supabase = createClient();
    await supabase.from("specialties").delete().eq("id", item.id);
    setData(data.filter((d) => d.id !== item.id));
  };

  const handleSave = async () => {
    const supabase = createClient();
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description || null,
      icon_url: form.icon_url || null,
    };
    if (editing) {
      await supabase.from("specialties").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("specialties").insert(payload);
    }
    const { data: items } = await supabase.from("specialties").select("*").order("name");
    if (items) setData(items as Specialty[]);
    setModalOpen(false);
  };

  const columns = [
    { key: "name", label: "Name", className: "text-gray-900 font-medium" },
    { key: "slug", label: "Slug", className: "text-gray-500" },
    {
      key: "description",
      label: "Description",
      render: (s: Specialty) => s.description ? s.description.substring(0, 80) + "..." : "-",
      className: "text-gray-500 max-w-xs truncate",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Specialties</h1>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-[#065c2c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#054d24] transition-colors">
          <Plus size={16} /> <span className="hidden sm:inline">Add Specialty</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onEdit={openEdit}
        onDelete={handleDelete}
        loading={loading}
        searchPlaceholder="Search specialties..."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Specialty" : "Add Specialty"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#065c2c]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#065c2c]"
                placeholder="auto-generated"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-500 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#065c2c] resize-y"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-500 mb-1.5">Icon URL</label>
              <input
                value={form.icon_url}
                onChange={(e) => setForm({ ...form, icon_url: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#065c2c]"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} className="rounded-lg bg-[#065c2c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#054d24] transition-colors">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
