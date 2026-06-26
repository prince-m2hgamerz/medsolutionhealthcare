const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
const ref = url.hostname.split(".")[0];
const projectUrl = `https://${ref}.supabase.co`;

const sql = [
  "ALTER TABLE doctors ADD COLUMN IF NOT EXISTS designation TEXT;",
  "ALTER TABLE doctors ADD COLUMN IF NOT EXISTS gender TEXT;",
  "ALTER TABLE doctors ADD COLUMN IF NOT EXISTS expertise TEXT[] DEFAULT '{}';",
  "ALTER TABLE doctors ADD COLUMN IF NOT EXISTS telephone TEXT;",
  "ALTER TABLE doctors ADD COLUMN IF NOT EXISTS profile_url TEXT;",
  "ALTER TABLE doctors ADD COLUMN IF NOT EXISTS appointment_url TEXT;",
].join(" ");

console.log("Project ref:", ref);
console.log("Running SQL via pg_dump endpoint...\n");

// Try pgaas/postgres endpoint
async function run() {
  const endpoints = [
    { url: `${projectUrl}/rest/v1/pg_dump`, method: "POST" },
    { url: `${projectUrl}/rest/v1/execute`, method: "POST" },
    { url: `${projectUrl}/rest/v1/sql`, method: "POST" },
    { url: `${projectUrl}/rest/v1/rpc/pg_execute`, method: "POST" },
  ];

  for (const ep of endpoints) {
    console.log(`Trying ${ep.url}...`);
    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
        body: JSON.stringify({ query: sql }),
      });
      console.log(`  Status: ${res.status}`);
      const text = await res.text();
      console.log(`  Response: ${text.substring(0, 300)}`);
      if (res.ok) {
        console.log("\nSUCCESS!");
        return;
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }

  console.log("\nAll endpoints failed. Please apply migration 008 manually.");
}

run().catch((e) => console.error("Error:", e.message));
