import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: h, error: he } = await supabase.from("hospitals").select("name, slug, id");
  if (he) { console.error("Hospitals error:", he); return; }
  console.log("Hospitals:", JSON.stringify(h, null, 2));
}
main().catch(console.error);
