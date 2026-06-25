"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  helper?: string;
}

const BUCKET = "site-images";

export default function ImageUploadField({ label, value, onChange, folder, helper }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    const supabase = createClient();
    const extension = file.name.split(".").pop() || "jpg";
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const path = `${folder}/${Date.now()}-${safeName || "image"}.${extension}`;

    setUploading(true);
    setError("");

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
  };

  const handleRemove = async () => {
    const path = getStoragePath(value);
    if (path) {
      const supabase = createClient();
      await supabase.storage.from(BUCKET).remove([path]);
    }
    onChange("");
  };

  return (
    <div className="rounded-lg border border-border bg-surface-white p-4 shadow-card">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <label className="block text-caption font-medium text-text">{label}</label>
          {helper && <p className="mt-1 text-micro text-text-muted">{helper}</p>}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-caption text-text-muted transition-colors hover:bg-surface hover:text-text disabled:opacity-50"
        >
          <Upload size={15} />
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleUpload(event.target.files?.[0])}
      />

      {value ? (
        <div className="space-y-3">
          <div className="relative h-36 overflow-hidden rounded-md border border-border bg-surface">
            <Image src={value} alt={label} fill className="object-cover" />
          </div>
          <input
            type="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-caption text-text focus:border-border-focus focus:outline-none"
            placeholder="Image URL"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 text-caption text-red-500 transition-colors hover:text-red-600"
          >
            <Trash2 size={14} /> Remove image
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-36 w-full flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface text-caption text-text-muted transition-colors hover:border-text-muted hover:text-text"
        >
          <ImagePlus size={24} className="mb-2" />
          Choose image
        </button>
      )}

      {error && <p className="mt-2 text-caption text-red-500">{error}</p>}
    </div>
  );
}

function getStoragePath(url: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return null;
  return decodeURIComponent(url.slice(markerIndex + marker.length).split("?")[0]);
}
