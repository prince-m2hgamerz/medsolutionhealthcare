import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: doc, error: de } = await supabase.from("doctors").select("*").limit(1);
  if (de) { console.error("Doctors error:", de); return; }
  console.log("Doctor columns:", Object.keys(doc[0] || {}));
  console.log("Doctor sample:", JSON.stringify(doc[0], null, 2));

  const { data: hos, error: he } = await supabase.from("hospitals").select("*").limit(1);
  if (he) { console.error("Hospitals error:", he); return; }
  console.log("Hospital columns:", Object.keys(hos[0] || {}));

  const { count, error: ce } = await supabase.from("doctors").select("*", { count: "exact", head: true });
  if (ce) { console.error("Count error:", ce); return; }
  console.log("Current doctor count:", count);
}
main().catch(console.error);
