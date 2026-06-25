"use client";

import { useEffect, useState } from "react";
import { Plus, Star } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { createClient } from "@/lib/supabase/client";

interface HotelItem {
  id: string;
  name: string;
  address: string;
  stars: number;
  price_range: string;
  photo_url: string | null;
}

export default function AdminHotelsPage() {
  const [data, setData] = useState<HotelItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HotelItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", address: "", stars: 3, price_range: "$$", photo_url: "" });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("hotels").select("*").order("name").then(({ data: items }) => {
      if (items) setData(items as HotelItem[]);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ name: "", address: "", stars: 3, price_range: "$$", photo_url: "" }); setModalOpen(true); };
  const openEdit = (item: HotelItem) => { setEditing(item); setForm({ name: item.name, address: item.address, stars: item.stars || 3, price_range: item.price_range || "$$", photo_url: item.photo_url || "" }); setModalOpen(true); };
  const handleDelete = async (item: HotelItem) => {
    if (!confirm(`Delete ${item.name}?`)) return;
    const supabase = createClient();
    await supabase.from("hotels").delete().eq("id", item.id);
    setData(data.filter((d) => d.id !== item.id));
  };
  const handleSave = async () => {
    const supabase = createClient();
    const payload = { name: form.name, address: form.address, stars: form.stars, price_range: form.price_range, photo_url: form.photo_url || null };
    if (editing) {
      await supabase.from("hotels").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("hotels").insert(payload);
    }
    const { data: items } = await supabase.from("hotels").select("*").order("name");
    if (items) setData(items as HotelItem[]);
    setModalOpen(false);
  };

  const columns = [
    { key: "name", label: "Name", className: "text-ink font-medium" },
    { key: "address", label: "Address", className: "text-shade-50" },
    { key: "stars", label: "Stars", render: (h: HotelItem) => <span className="inline-flex items-center gap-1 text-shade-50">{h.stars}<Star size={14} className="fill-current" /></span> },
    { key: "price_range", label: "Price Range", className: "text-shade-50" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-ink">Hotels</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> <span className="hidden sm:inline">Add Hotel</span></button>
      </div>
      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} loading={loading} searchPlaceholder="Search hotels..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Hotel" : "Add Hotel"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-caption text-shade-50 mb-1.5">Hotel Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-caption text-shade-50 mb-1.5">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Price Range</label>
              <select value={form.price_range} onChange={(e) => setForm({ ...form, price_range: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink">
                <option value="$">$ - Budget</option>
                <option value="$$">$$ - Mid-range</option>
                <option value="$$$">$$$ - Luxury</option>
                <option value="$$$$">$$$$ - Ultra Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Stars</label>
              <select value={form.stars} onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink">
                {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} Star{s > 1 ? "s" : ""}</option>)}
              </select>
            </div>
          </div>
          <ImageUploadField
            label="Hotel image"
            value={form.photo_url}
            onChange={(photo_url) => setForm({ ...form, photo_url })}
            folder="hotels"
            helper="Used when hotels are displayed on the public site."
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
