import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendLeadNotification, sendCustomerConfirmation } from "@/lib/email";

const ALLOWED_FIELDS = ["name", "email", "phone", "message", "treatment", "country", "medical_condition"] as const;

function validateInquiryBody(body: Record<string, unknown>) {
  const validated: Record<string, string> = { status: "new", form_type: "Inquiry" };
  for (const key of ALLOWED_FIELDS) {
    const val = body[key];
    if (val !== undefined && val !== null) validated[key] = String(val).trim();
  }
  if (!validated.email) return { error: "Email is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validated.email)) return { error: "Invalid email format" };
  if (!validated.name) return { error: "Name is required" };
  if (validated.name.length > 200) return { error: "Name too long" };
  if (validated.message && validated.message.length > 5000) return { error: "Message too long" };
  return { data: validated };
}

export async function POST(request: Request) {
  try {
    const body: Record<string, unknown> = await request.json();
    const validated = validateInquiryBody(body);
    if (validated.error) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("leads")
      .insert([validated.data as never])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 400 });
    }

    const lead = data as Record<string, unknown>;

    await Promise.allSettled([
      sendLeadNotification(lead),
      sendCustomerConfirmation(lead),
    ]);

    return NextResponse.json({ message: "Inquiry submitted successfully", id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
