"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { createClient } from "@/lib/supabase/client";

interface InsuranceItem {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export default function AdminInsurancePage() {
  const [data, setData] = useState<InsuranceItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<InsuranceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", logo_url: "" });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("insurance_companies").select("*").order("name").then(({ data: items }) => {
      if (items) setData(items as InsuranceItem[]);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", slug: "", logo_url: "" }); setModalOpen(true); };
  const openEdit = (item: InsuranceItem) => { setEditing(item); setForm({ name: item.name, slug: item.slug, logo_url: item.logo_url || "" }); setModalOpen(true); };
  const handleDelete = async (item: InsuranceItem) => {
    if (!confirm(`Delete ${item.name}?`)) return;
    const supabase = createClient();
    await supabase.from("insurance_companies").delete().eq("id", item.id);
    setData(data.filter((d) => d.id !== item.id));
  };
  const handleSave = async () => {
    const supabase = createClient();
    const payload = { name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"), logo_url: form.logo_url || null };
    if (editing) {
      await supabase.from("insurance_companies").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("insurance_companies").insert(payload);
    }
    const { data: items } = await supabase.from("insurance_companies").select("*").order("name");
    if (items) setData(items as InsuranceItem[]);
    setModalOpen(false);
  };

  const columns = [
    { key: "name", label: "Name", className: "text-ink font-medium" },
    { key: "slug", label: "Slug", className: "text-shade-50" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-ink">Insurance Companies</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> <span className="hidden sm:inline">Add Company</span></button>
      </div>
      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} loading={loading} searchPlaceholder="Search insurance..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Insurance Company" : "Add Insurance Company"}>
        <div className="space-y-4">
          <div>
            <label className="block text-caption text-shade-50 mb-1.5">Company Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
          </div>
          <div>
            <label className="block text-caption text-shade-50 mb-1.5">Slug (leave blank to auto-generate)</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" placeholder="auto-generated" />
          </div>
          <ImageUploadField
            label="Insurance logo"
            value={form.logo_url}
            onChange={(logo_url) => setForm({ ...form, logo_url })}
            folder="insurance"
            helper="Used on insurance partner cards."
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-hairline-light">
            <button onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button onClick={handleSave} className="btn-primary">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
