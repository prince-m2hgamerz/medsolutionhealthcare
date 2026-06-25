import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface HospitalData {
  name: string;
  city: string;
  slug: string;
}

interface DoctorData {
  name: string;
  specialty: string;
  hospital: string;
  slug: string;
}

interface TreatmentData {
  name: string;
  category: string;
  costMin: number;
  costMax: number;
  slug: string;
}

const DATA_DIR = path.join(__dirname, "data");

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function seedHospitals(hospitals: HospitalData[]): Promise<number> {
  let inserted = 0;
  for (const h of hospitals) {
    const { error } = await supabase.from("hospitals").upsert(
      {
        name: h.name,
        slug: h.slug,
        city: h.city,
        state: "Delhi",
        beds_count: 0,
        accreditations: [],
        about: null,
        is_featured: false,
      },
      { onConflict: "slug" }
    );
    if (error) {
      console.error(`  Error inserting hospital "${h.name}": ${error.message}`);
    } else {
      inserted++;
    }
  }
  return inserted;
}

async function seedDoctors(doctors: DoctorData[]): Promise<number> {
  let inserted = 0;
  for (const d of doctors) {
    const { error } = await supabase.from("doctors").upsert(
      {
        name: d.name,
        slug: d.slug,
        specialties: [d.specialty],
        qualifications: "MBBS, MD",
        experience_years: 15,
        about: null,
        photo_url: null,
        is_featured: false,
      },
      { onConflict: "slug" }
    );
    if (error) {
      console.error(`  Error inserting doctor "${d.name}": ${error.message}`);
    } else {
      inserted++;
    }
  }
  return inserted;
}

async function seedTreatments(treatments: TreatmentData[]): Promise<number> {
  let inserted = 0;
  for (const t of treatments) {
    const { error } = await supabase.from("treatments").upsert(
      {
        name: t.name,
        slug: t.slug,
        category: t.category,
        cost_usd_min: t.costMin,
        cost_usd_max: t.costMax,
        description: null,
        is_featured: false,
      },
      { onConflict: "slug" }
    );
    if (error) {
      console.error(`  Error inserting treatment "${t.name}": ${error.message}`);
    } else {
      inserted++;
    }
  }
  return inserted;
}

async function seed() {
  console.log("=== Satyug Healthcare Seeder ===\n");

  // Read data files
  const hospitalsPath = path.join(DATA_DIR, "hospitals.json");
  const doctorsPath = path.join(DATA_DIR, "doctors.json");
  const treatmentsPath = path.join(DATA_DIR, "treatments.json");

  if (!fs.existsSync(hospitalsPath) || !fs.existsSync(doctorsPath) || !fs.existsSync(treatmentsPath)) {
    console.error("Data files not found. Run `npm run crawl` first.");
    console.error(`Expected files in: ${DATA_DIR}`);
    process.exit(1);
  }

  const hospitals: HospitalData[] = JSON.parse(fs.readFileSync(hospitalsPath, "utf-8"));
  const doctors: DoctorData[] = JSON.parse(fs.readFileSync(doctorsPath, "utf-8"));
  const treatments: TreatmentData[] = JSON.parse(fs.readFileSync(treatmentsPath, "utf-8"));

  console.log(`Loaded data:`);
  console.log(`  Hospitals: ${hospitals.length}`);
  console.log(`  Doctors: ${doctors.length}`);
  console.log(`  Treatments: ${treatments.length}\n`);

  // Seed hospitals
  console.log("1. Seeding hospitals...");
  const hospitalsInserted = await seedHospitals(hospitals);
  console.log(`   Inserted/Updated: ${hospitalsInserted}`);

  // Seed doctors
  console.log("\n2. Seeding doctors...");
  const doctorsInserted = await seedDoctors(doctors);
  console.log(`   Inserted/Updated: ${doctorsInserted}`);

  // Seed treatments
  console.log("\n3. Seeding treatments...");
  const treatmentsInserted = await seedTreatments(treatments);
  console.log(`   Inserted/Updated: ${treatmentsInserted}`);

  console.log(`\n=== Seed Complete ===`);
  console.log(`Total records processed:`);
  console.log(`  Hospitals: ${hospitalsInserted}/${hospitals.length}`);
  console.log(`  Doctors: ${doctorsInserted}/${doctors.length}`);
  console.log(`  Treatments: ${treatmentsInserted}/${treatments.length}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
