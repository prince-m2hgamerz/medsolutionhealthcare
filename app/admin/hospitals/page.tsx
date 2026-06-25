"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { createClient } from "@/lib/supabase/client";

interface Hospital {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  city: string;
  state: string;
  beds_count: number;
  accreditations: string[];
  is_featured: boolean;
}

export default function AdminHospitalsPage() {
  const [data, setData] = useState<Hospital[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", logo_url: "", city: "", state: "", beds_count: 0, accreditations: "", is_featured: false });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("hospitals").select("*").order("name").then(({ data: items }) => {
      if (items) setData(items as Hospital[]);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", slug: "", logo_url: "", city: "", state: "", beds_count: 0, accreditations: "", is_featured: false }); setModalOpen(true); };
  const openEdit = (item: Hospital) => {
    setEditing(item);
    setForm({ name: item.name, slug: item.slug, logo_url: item.logo_url || "", city: item.city, state: item.state, beds_count: item.beds_count || 0, accreditations: item.accreditations?.join(", ") || "", is_featured: item.is_featured || false });
    setModalOpen(true);
  };
  const handleDelete = async (item: Hospital) => {
    if (!confirm(`Delete ${item.name}?`)) return;
    const supabase = createClient();
    await supabase.from("hospitals").delete().eq("id", item.id);
    setData(data.filter((d) => d.id !== item.id));
  };
  const handleSave = async () => {
    const supabase = createClient();
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      logo_url: form.logo_url || null,
      city: form.city,
      state: form.state,
      beds_count: form.beds_count,
      accreditations: form.accreditations.split(",").map((s) => s.trim()).filter(Boolean),
      is_featured: form.is_featured,
    };
    if (editing) {
      await supabase.from("hospitals").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("hospitals").insert(payload);
    }
    const { data: items } = await supabase.from("hospitals").select("*").order("name");
    if (items) setData(items as Hospital[]);
    setModalOpen(false);
  };

  const columns = [
    { key: "name", label: "Name", className: "text-ink font-medium" },
    { key: "city", label: "City", className: "text-shade-50" },
    { key: "beds_count", label: "Beds", render: (h: Hospital) => h.beds_count?.toLocaleString() || 0, className: "text-shade-50" },
    { key: "accreditations", label: "Accreditations", render: (h: Hospital) => h.accreditations?.join(", ") || "-", className: "text-shade-50" },
    { key: "is_featured", label: "Featured", render: (h: Hospital) => h.is_featured ? <CheckCircle2 size={18} className="text-ink" /> : <Circle size={18} className="text-shade-30" /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-ink">Hospitals</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> <span className="hidden sm:inline">Add Hospital</span></button>
      </div>
      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} loading={loading} searchPlaceholder="Search hospitals..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Hospital" : "Add Hospital"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Hospital Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" placeholder="auto-generated" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">State</label>
              <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Total Beds</label>
              <input type="number" value={form.beds_count} onChange={(e) => setForm({ ...form, beds_count: Number(e.target.value) })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Accreditations (comma-separated)</label>
              <input value={form.accreditations} onChange={(e) => setForm({ ...form, accreditations: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" placeholder="JCI, NABH" />
            </div>
          </div>
          <ImageUploadField
            label="Hospital image"
            value={form.logo_url}
            onChange={(logo_url) => setForm({ ...form, logo_url })}
            folder="hospitals"
            helper="Used on hospital cards and profile pages."
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-hairline-light" />
            <label htmlFor="featured" className="text-body-md text-shade-50">Featured hospital</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-hairline-light">
            <button onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button onClick={handleSave} className="btn-primary">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
