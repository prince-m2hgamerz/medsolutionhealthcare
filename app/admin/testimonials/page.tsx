"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface Testimonial {
  id: string;
  patient_name: string;
  country: string;
  treatment: string;
  text_content: string;
  rating: number;
  is_approved: boolean;
  video_url: string;
  created_at: string;
}

async function api(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    setLoading(true);
    try {
      const data = await api(
        "/api/admin/manage?table=testimonials&order=created_at&orderDirection=desc"
      );
      setTestimonials(data);
    } finally {
      setLoading(false);
    }
  }

  async function toggleApproval(t: Testimonial) {
    try {
      await api("/api/admin/manage", {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          table: "testimonials",
          id: t.id,
          data: { is_approved: !t.is_approved },
        }),
      });
      toast.success(`Testimonial ${t.is_approved ? "unapproved" : "approved"}`);
      await loadTestimonials();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Testimonials</h1>

      {testimonials.length === 0 ? (
        <p className="text-muted-foreground">No testimonials found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{t.patient_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t.country} — {t.treatment}
                  </p>
                </div>
                <Badge variant={t.is_approved ? "default" : "secondary"}>
                  {t.is_approved ? "Approved" : "Pending"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {t.text_content}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-sm">
                    {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                  </span>
                </div>
                {t.video_url && (
                  <p className="text-xs text-muted-foreground truncate">
                    Video: {t.video_url}
                  </p>
                )}
                <Button
                  variant={t.is_approved ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleApproval(t)}
                >
                  {t.is_approved ? "Unapprove" : "Approve"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
