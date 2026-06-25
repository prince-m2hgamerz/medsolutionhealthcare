import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendLeadNotification, sendCustomerConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body: Record<string, unknown> = await request.json();

    // Use service role key to bypass RLS for lead inserts
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Build message combining treatment info and user message
    const messageParts: string[] = [];
    if (body.treatment) messageParts.push(`Treatment: ${body.treatment}`);
    if (body.medical_condition) messageParts.push(`Condition: ${body.medical_condition}`);
    if (body.message) messageParts.push(String(body.message));
    const combinedMessage = messageParts.join("\n") || null;

    // Insert into leads table with only valid fields
    const { data, error } = await supabase
      .from("leads")
      .insert([{
        name: String(body.name || "Unknown"),
        email: body.email ? String(body.email) : null,
        phone: String(body.phone || ""),
        country: String(body.country || "International"),
        form_type: String(body.form_type || "Contact"),
        message: combinedMessage,
        status: "new",
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase leads insert error:", error);
      return NextResponse.json({ error: "Failed to create lead" }, { status: 400 });
    }

    const lead = data as Record<string, unknown>;

    // Send email notifications (non-blocking)
    Promise.allSettled([
      sendLeadNotification(lead),
      sendCustomerConfirmation(lead),
    ]).catch(() => {});

    return NextResponse.json({ message: "Lead created successfully" }, { status: 201 });
  } catch (err) {
    console.error("API /api/leads error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
