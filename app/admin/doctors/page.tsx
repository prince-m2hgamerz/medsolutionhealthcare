"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { createClient } from "@/lib/supabase/client";

interface Doctor {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
  specialties: string[];
  experience_years: number;
  is_featured: boolean;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", photo_url: "", specialties: "", experience_years: 0, is_featured: false });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("doctors").select("*").order("name").then(({ data }) => {
      if (data) setDoctors(data as Doctor[]);
      setLoading(false);
    });
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", slug: "", photo_url: "", specialties: "", experience_years: 0, is_featured: false });
    setModalOpen(true);
  };

  const openEdit = (doc: Doctor) => {
    setEditing(doc);
    setForm({
      name: doc.name,
      slug: doc.slug,
      photo_url: doc.photo_url || "",
      specialties: doc.specialties?.join(", ") || "",
      experience_years: doc.experience_years || 0,
      is_featured: doc.is_featured || false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (doc: Doctor) => {
    if (!confirm(`Delete ${doc.name}?`)) return;
    const supabase = createClient();
    await supabase.from("doctors").delete().eq("id", doc.id);
    setDoctors(doctors.filter((d) => d.id !== doc.id));
  };

  const handleSave = async () => {
    const supabase = createClient();
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      photo_url: form.photo_url || null,
      specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
      experience_years: form.experience_years,
      is_featured: form.is_featured,
    };
    if (editing) {
      await supabase.from("doctors").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("doctors").insert(payload);
    }
    const { data } = await supabase.from("doctors").select("*").order("name");
    if (data) setDoctors(data as Doctor[]);
    setModalOpen(false);
  };

  const columns = [
    { key: "name", label: "Name", className: "text-ink font-medium" },
    { key: "specialties", label: "Specialties", render: (d: Doctor) => d.specialties?.join(", ") || "-", className: "text-shade-50" },
    { key: "experience_years", label: "Experience", render: (d: Doctor) => `${d.experience_years || 0} years`, className: "text-shade-50" },
    { key: "is_featured", label: "Featured", render: (d: Doctor) => d.is_featured ? <CheckCircle2 size={18} className="text-ink" /> : <Circle size={18} className="text-shade-30" /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-ink">Doctors</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> <span className="hidden sm:inline">Add Doctor</span></button>
      </div>
      <DataTable columns={columns} data={doctors} onEdit={openEdit} onDelete={handleDelete} loading={loading} searchPlaceholder="Search doctors..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Doctor" : "Add Doctor"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" placeholder="Dr. Name" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" placeholder="auto-generated" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Specialties (comma-separated)</label>
              <input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" placeholder="Cardiologist, Surgeon" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Experience (years)</label>
              <input type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
          </div>
          <ImageUploadField
            label="Doctor photo"
            value={form.photo_url}
            onChange={(photo_url) => setForm({ ...form, photo_url })}
            folder="doctors"
            helper="Used on doctor cards and profile pages."
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-hairline-light" />
            <label htmlFor="featured" className="text-body-md text-shade-50">Featured doctor</label>
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
