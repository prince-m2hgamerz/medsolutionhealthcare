"use client";

import { useEffect, useState } from "react";
import LeadsTable, { type Lead } from "@/components/admin/LeadsTable";
import { createClient } from "@/lib/supabase/client";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100).then(({ data }) => {
      if (data) setLeads(data as Lead[]);
      setLoading(false);
    });
  }, []);

  const handleUpdateLead = async (
    lead: Lead,
    updates: Partial<Pick<Lead, "status" | "notes" | "assigned_to">>
  ) => {
    const supabase = createClient();
    const { error } = await supabase.from("leads").update(updates).eq("id", lead.id);

    if (error) {
      console.error(error);
      return;
    }

    setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, ...updates } : item));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-ink">Leads</h1>
      </div>
      <LeadsTable leads={leads} loading={loading} onUpdateLead={handleUpdateLead} />
    </div>
  );
}
