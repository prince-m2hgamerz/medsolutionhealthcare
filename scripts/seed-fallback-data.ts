import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });



const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  console.error("Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface DoctorRecord {
  name: string;
  slug: string;
  specialty: string;
  hospital: string;
  hospitalSlug: string;
  designation: string;
  qualifications: string;
  photo_url: string | null;
  profileUrl: string | null;
  appointmentUrl: string | null;
  gender: string;
  experienceYears?: number;
  isFeatured?: boolean;
  about?: string;
  expertise: string[];
  telephone: string;
}

async function main() {
  console.log("=== Seed Fallback Data to Database ===\n");

  // 1. Load fallback data from lib/doctors-data.ts
  console.log("Loading fallback data...");
  const fallback = await import(path.join(__dirname, "..", "lib", "doctors-data"));
  const allDoctors: DoctorRecord[] = fallback.allDoctors;
  const hospitalImageBySlug: Record<string, string> = fallback.hospitalImageBySlug;

  console.log(`  Doctors loaded: ${allDoctors.length}`);
  console.log(`  Hospital images: ${Object.keys(hospitalImageBySlug).length}\n`);

  // 2. Build hospital slug → id map from DB
  console.log("Fetching hospitals from database...");
  const { data: hospitals, error: hospError } = await supabase
    .from("hospitals")
    .select("id, slug");

  if (hospError) {
    console.error("Error fetching hospitals:", hospError.message);
    process.exit(1);
  }

  const hospitalSlugToId = new Map<string, string>();
  for (const h of hospitals) {
    hospitalSlugToId.set(h.slug, h.id);
  }
  console.log(`  Hospitals in DB: ${hospitals.length}`);

  // Report any hospital slugs in fallback data not in DB
  const missingHospitals = new Set<string>();
  for (const d of allDoctors) {
    if (!hospitalSlugToId.has(d.hospitalSlug)) {
      missingHospitals.add(d.hospitalSlug);
    }
  }
  if (missingHospitals.size > 0) {
    console.warn(`  WARNING: ${missingHospitals.size} hospital slugs from fallback not found in DB:`);
    for (const slug of missingHospitals) {
      console.warn(`    - ${slug}`);
    }
    console.warn("  Doctors for these hospitals will be SKIPPED.\n");
  }

  // 3. Update hospital logo_urls from hospitalImageBySlug
  // Only for hospitals whose slugs match
  console.log("Updating hospital logo URLs...");
  let updatedLogos = 0;
  for (const [slug, imageUrl] of Object.entries(hospitalImageBySlug)) {
    const id = hospitalSlugToId.get(slug);
    if (!id) {
      console.warn(`  WARNING: Hospital slug "${slug}" not found in DB, skipping logo update`);
      continue;
    }
    const { error } = await supabase
      .from("hospitals")
      .update({ logo_url: imageUrl })
      .eq("id", id);

    if (error) {
      console.error(`  Error updating logo for "${slug}": ${error.message}`);
    } else {
      updatedLogos++;
    }
  }
  console.log(`  Updated logos: ${updatedLogos}/${Object.keys(hospitalImageBySlug).length}\n`);

  // 4. Upsert all doctors in batches
  console.log("Upserting doctors...");
  const BATCH_SIZE = 100;
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < allDoctors.length; i += BATCH_SIZE) {
    const batch = allDoctors.slice(i, i + BATCH_SIZE);
    const records = batch
      .filter((d) => hospitalSlugToId.has(d.hospitalSlug))
      .map((d) => ({
        name: d.name,
        slug: d.slug,
        photo_url: d.photo_url,
        specialties: [d.specialty],
        experience_years: d.experienceYears ?? null,
        hospital_id: hospitalSlugToId.get(d.hospitalSlug)!,
        qualifications: d.qualifications || null,
        about: d.about || null,
        is_featured: d.isFeatured ?? false,
        designation: d.designation || null,
        gender: d.gender || null,
        expertise: d.expertise || [],
        telephone: d.telephone || null,
        profile_url: d.profileUrl || null,
        appointment_url: d.appointmentUrl || null,
      }));

    // Track skipped count
    skipped += batch.length - records.length;

    if (records.length === 0) continue;

    const { error } = await supabase.from("doctors").upsert(
      records as any,
      {
        onConflict: "slug",
        ignoreDuplicates: false,
      }
    );

    if (error) {
      console.error(`  Batch ${i / BATCH_SIZE + 1} error: ${error.message}`);
      errors++;
    } else {
      inserted += records.length;
    }

    if ((i / BATCH_SIZE + 1) % 5 === 0 || i + BATCH_SIZE >= allDoctors.length) {
      console.log(`  Processed ${Math.min(i + BATCH_SIZE, allDoctors.length)}/${allDoctors.length} doctors (${inserted} upserted, ${skipped} skipped, ${errors} batch errors)`);
    }
  }

  console.log(`\n=== Seed Complete ===`);
  console.log(`  Doctors upserted: ${inserted}`);
  console.log(`  Skipped (no hospital): ${skipped}`);
  console.log(`  Hospitals with updated logos: ${updatedLogos}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
