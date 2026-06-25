"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { createClient } from "@/lib/supabase/client";

interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnail_url: string | null;
  author: string;
  is_published: boolean;
  published_at: string;
}

export default function AdminBlogsPage() {
  const [data, setData] = useState<Blog[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", slug: "", category: "", thumbnail_url: "", author: "Asians Team", content: "", is_published: false });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("blogs").select("*").order("published_at", { ascending: false }).then(({ data: items }) => {
      if (items) setData(items as Blog[]);
      setLoading(false);
    });
  }, []);

  const openAdd = () => { setEditing(null); setForm({ title: "", slug: "", category: "", thumbnail_url: "", author: "Asians Team", content: "", is_published: false }); setModalOpen(true); };
  const openEdit = (item: Blog) => {
    setEditing(item);
    setForm({ title: item.title, slug: item.slug, category: item.category, thumbnail_url: item.thumbnail_url || "", author: item.author, content: item.content, is_published: item.is_published });
    setModalOpen(true);
  };
  const handleDelete = async (item: Blog) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const supabase = createClient();
    await supabase.from("blogs").delete().eq("id", item.id);
    setData(data.filter((d) => d.id !== item.id));
  };
  const handleSave = async () => {
    const supabase = createClient();
    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      category: form.category,
      thumbnail_url: form.thumbnail_url || null,
      author: form.author,
      content: form.content,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
    };
    if (editing) {
      await supabase.from("blogs").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("blogs").insert(payload);
    }
    const { data: items } = await supabase.from("blogs").select("*").order("published_at", { ascending: false });
    if (items) setData(items as Blog[]);
    setModalOpen(false);
  };

  const columns = [
    { key: "title", label: "Title", className: "text-ink font-medium max-w-xs truncate" },
    { key: "category", label: "Category", className: "text-shade-50" },
    { key: "author", label: "Author", className: "text-shade-50" },
    {
      key: "is_published",
      label: "Status",
      render: (b: Blog) => b.is_published
        ? <span className="text-aloe-10 bg-aloe-10/20 rounded-pill px-2 py-0.5 text-micro">Published</span>
        : <span className="text-shade-40 bg-shade-30 rounded-pill px-2 py-0.5 text-micro">Draft</span>,
    },
    { key: "published_at", label: "Date", render: (b: Blog) => b.published_at ? new Date(b.published_at).toLocaleDateString() : "-", className: "text-shade-40" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-ink">Blogs</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> <span className="hidden sm:inline">New Post</span></button>
      </div>
      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} loading={loading} searchPlaceholder="Search blogs..." />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Blog Post" : "New Blog Post"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-caption text-shade-50 mb-1.5">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
            <div className="col-span-2">
              <label className="block text-caption text-shade-50 mb-1.5">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" placeholder="auto-generated" />
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink">
                <option value="">Select...</option>
                <option value="Medical Visa Guide">Medical Visa Guide</option>
                <option value="Treatment Blog">Treatment Blog</option>
                <option value="Tourism Blog">Tourism Blog</option>
              </select>
            </div>
            <div>
              <label className="block text-caption text-shade-50 mb-1.5">Author</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink" />
            </div>
          </div>
          <ImageUploadField
            label="Blog thumbnail"
            value={form.thumbnail_url}
            onChange={(thumbnail_url) => setForm({ ...form, thumbnail_url })}
            folder="blogs"
            helper="Used on the blog listing and article previews."
          />
          <div>
            <label className="block text-caption text-shade-50 mb-1.5">Content</label>
            <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded border-hairline-light" />
            <label htmlFor="published" className="text-body-md text-shade-50">Publish immediately</label>
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
