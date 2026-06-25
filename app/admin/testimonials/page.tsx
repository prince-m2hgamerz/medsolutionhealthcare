"use client";

import { useEffect, useState } from "react";
import { Check, X, Star, Video } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Testimonial {
  id: string;
  patient_name: string;
  country: string;
  treatment: string;
  text_content: string;
  rating: number;
  is_approved: boolean;
  video_url: string | null;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setTestimonials(data as Testimonial[]);
    });
  }, []);

  const toggleApproval = async (t: Testimonial) => {
    const supabase = createClient();
    const newVal = !t.is_approved;
    await supabase.from("testimonials").update({ is_approved: newVal }).eq("id", t.id);
    setTestimonials(testimonials.map((item) => item.id === t.id ? { ...item, is_approved: newVal } : item));
  };

  return (
    <div>
      <h1 className="font-display text-heading-xl text-ink mb-8">Testimonials</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className={`bg-canvas-light rounded-lg border p-6 transition-all ${t.is_approved ? "border-aloe-10" : "border-hairline-light"}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-heading-sm text-ink">{t.patient_name}</h3>
                <p className="text-caption text-shade-40">{t.country} &middot; {t.treatment}</p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className={j < t.rating ? "fill-yellow-400 text-yellow-400" : "text-shade-30"} />
                ))}
              </div>
            </div>
            <p className="text-body-md text-shade-50 leading-relaxed mb-4">&ldquo;{t.text_content}&rdquo;</p>
            {t.video_url && (
              <a href={t.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-caption text-link-mint hover:text-link-mint/80 mb-3 transition-colors min-h-[36px]">
                <Video size={14} /> Watch Video
              </a>
            )}
            <div className="flex items-center gap-3 pt-3 border-t border-hairline-light">
              {t.is_approved ? (
                <span className="flex items-center gap-1.5 text-caption text-aloe-10 bg-aloe-10/20 rounded-pill px-3 py-1">
                  <Check size={14} /> Approved
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-caption text-shade-40 bg-shade-30 rounded-pill px-3 py-1">
                  Pending Review
                </span>
              )}
              <button
                onClick={() => toggleApproval(t)}
                className={`flex items-center gap-1.5 text-caption rounded-pill px-3 py-1.5 transition-colors min-h-[36px] ${
                  t.is_approved ? "text-shade-50 hover:bg-shade-30" : "text-aloe-10 hover:bg-aloe-10/20"
                }`}
              >
                {t.is_approved ? <X size={14} /> : <Check size={14} />}
                <span className="hidden sm:inline">{t.is_approved ? "Revoke" : "Approve"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
