import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const src = join(dirname(fileURLToPath(import.meta.url)), "..", "doctorsjsondata");

const HOSPITAL_MAP: Record<string, { id: string; name: string; slug: string; suffix: string }> = {
  "apollo-hospitals-delhi":             { id: "a0000001-0000-0000-0000-000000000003", name: "Apollo Hospitals Indraprastha",        slug: "apollo-hospitals-delhi",             suffix: "apollo" },
  "max-super-speciality-hospital-saket":{ id: "a0000001-0000-0000-0000-000000000005", name: "Max Super Speciality Hospital Saket",  slug: "max-super-speciality-hospital-saket",  suffix: "max" },
  "blk-max-super-speciality-hospital":  { id: "a0000001-0000-0000-0000-000000000007", name: "BLK-Max Super Speciality Hospital",    slug: "blk-max-super-speciality-hospital",    suffix: "blk" },
  "medanta-the-medicity":               { id: "a0000001-0000-0000-0000-000000000002", name: "Medanta - The Medicity",               slug: "medanta-the-medicity",                 suffix: "medanta" },
  "artemis-hospital-gurugram":          { id: "a0000001-0000-0000-0000-000000000008", name: "Artemis Hospital Gurugram",            slug: "artemis-hospital-gurugram",            suffix: "artemis" },
  "paras-hospital-gurugram":            { id: "a0000001-0000-0000-0000-00000000000e", name: "Paras Hospital Gurugram",              slug: "paras-hospital-gurugram",              suffix: "paras" },
};

function toSlug(name: string, suffix: string): string {
  return name
    .toLowerCase()
    .replace(/^(dr\.?|prof\.?|prof\s+\(dr\.\)|\(prof\.\)|col\.?)\s+/gi, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") +
    "-" + suffix;
}

function dedupSlugs(docs: any[]): any[] {
  const seen = new Set<string>();
  return docs.map(d => {
    let slug = d.slug;
    let n = 2;
    while (seen.has(slug)) {
      slug = d.slug + "-" + n++;
    }
    seen.add(slug);
    return { ...d, slug };
  });
}

function cleanImg(url: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const u = url.split("?")[0].trim();
  if (!u) return null;
  if (u.includes("defaultprofilepic") || u.includes("defaultprofile") || u.includes("Dummy_pic")) return null;
  return u;
}

function cleanSpecialty(raw: string): string {
  if (!raw) return "";
  return raw.replace(/&amp;/g, "&").split(",")[0].trim();
}

// ── Apollo ──
function loadApollo(hospitalId: string) {
  const raw = JSON.parse(readFileSync(join(src, "apollo.json"), "utf8"));
  const h = HOSPITAL_MAP["apollo-hospitals-delhi"];
  return dedupSlugs(raw.map((d: any) => ({
    name: d.name,
    slug: toSlug(d.name, h.suffix),
    specialties: [cleanSpecialty(d.medicalSpecialty)],
    hospital_id: hospitalId,
    designation: d.medicalSpecialty ? d.medicalSpecialty.replace(/&amp;/g, "&") : "",
    qualifications: "",
    photo_url: cleanImg(d.image),
    profile_url: d.url || null,
    gender: d.gender || "",
    expertise: [],
    appointment_url: null,
    telephone: d.telephone || "",
    experience_years: null,
    about: null,
    is_featured: false,
  })));
}

// ── Max ──
function loadMax(hospitalId: string) {
  const text = readFileSync(join(src, "max.json"), "utf8").trim();
  const inner = text.slice(1, text.lastIndexOf("}"));
  const raw = JSON.parse("[" + inner + "]");
  const h = HOSPITAL_MAP["max-super-speciality-hospital-saket"];
  return dedupSlugs(raw.map((d: any) => ({
    name: d.name,
    slug: toSlug(d.name, h.suffix),
    specialties: [cleanSpecialty(d.medicalSpecialty)],
    hospital_id: hospitalId,
    designation: d.medicalSpecialty ? d.medicalSpecialty.replace(/&amp;/g, "&") : "",
    qualifications: "",
    photo_url: cleanImg(d.image),
    profile_url: d.url || null,
    gender: d.gender || "",
    expertise: [],
    appointment_url: null,
    telephone: d.telephone || "",
    experience_years: null,
    about: null,
    is_featured: false,
  })));
}

// ── BLK ──
function loadBlk(hospitalId: string) {
  const raw = JSON.parse(readFileSync(join(src, "blkmax_doctors.json"), "utf8"));
  const h = HOSPITAL_MAP["blk-max-super-speciality-hospital"];
  return dedupSlugs(raw.map((d: any) => ({
    name: d.name,
    slug: toSlug(d.name, h.suffix),
    specialties: d.specialities?.length ? d.specialities : [],
    hospital_id: hospitalId,
    designation: d.designation || "",
    qualifications: "",
    photo_url: cleanImg(d.imageUrl),
    profile_url: d.profileUrl || null,
    gender: "",
    expertise: d.specialities || [],
    appointment_url: d.appointmentUrl || null,
    telephone: "",
    experience_years: null,
    about: null,
    is_featured: false,
  })));
}

// ── Medanta ──
function loadMedanta(hospitalId: string) {
  const raw = JSON.parse(readFileSync(join(src, "medanta_doctors.json"), "utf8"));
  const h = HOSPITAL_MAP["medanta-the-medicity"];
  const MEDANTA_IMG_BASE = "https://medanta.s3.ap-south-1.amazonaws.com/all-doctor-with-slug";
  return dedupSlugs(raw.map((d: any) => {
    const profileSlug = d.profileUrl ? d.profileUrl.split("/").filter(Boolean).pop() : null;
    const photo = profileSlug ? `${MEDANTA_IMG_BASE}/${profileSlug}.png` : null;
    return {
      name: d.name,
      slug: toSlug(d.name, h.suffix),
      specialties: d.speciality ? [d.speciality] : [],
      hospital_id: hospitalId,
      designation: d.designation || "",
      qualifications: Array.isArray(d.qualifications) ? d.qualifications.join(", ") : (d.qualifications || ""),
      photo_url: photo,
      profile_url: d.profileUrl || null,
      gender: "",
      expertise: Array.isArray(d.expertise) ? d.expertise : [],
      appointment_url: d.appointmentUrl || null,
      telephone: "",
      experience_years: null,
      about: null,
      is_featured: false,
    };
  }));
}

// ── Artemis ──
function loadArtemis(hospitalId: string) {
  const raw = JSON.parse(readFileSync(join(src, "artemis.json"), "utf8"));
  const h = HOSPITAL_MAP["artemis-hospital-gurugram"];
  const entries = raw.filter((d: any) => typeof d.profile === "string" && d.profile.includes("/doctor/profile/"));
  return dedupSlugs(entries.map((d: any) => {
    const slug = d.profile.split("/").filter(Boolean).pop() || "";
    const imgSlug = slug.replace(/^dr-/i, "");
    const name = "Dr. " + slug
      .replace(/^dr-/, "")
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      name,
      slug: slug + "-" + h.suffix,
      specialties: ["Specialist"],
      hospital_id: hospitalId,
      designation: "Consultant",
      qualifications: "",
      photo_url: `https://www.artemishospitals.com/BackEndImages/DoctorImage/dr-dr-${imgSlug}.jpg`,
      profile_url: d.profile,
      gender: "",
      expertise: [],
      appointment_url: null,
      telephone: "",
      experience_years: null,
      about: null,
      is_featured: false,
    };
  }));
}

// ── Paras ──
function loadParas(hospitalId: string) {
  const raw = JSON.parse(readFileSync(join(src, "paras_doctors.json"), "utf8"));
  const h = HOSPITAL_MAP["paras-hospital-gurugram"];
  return dedupSlugs(raw.filter((d: any) => d.name && d.name.trim()).map((d: any) => {
    const fullName = /^Dr\.?\s/i.test(d.name) ? d.name : "Dr. " + d.name;
    return {
      name: fullName,
      slug: toSlug(fullName, h.suffix),
      specialties: ["Specialist"],
      hospital_id: hospitalId,
      designation: "Consultant",
      qualifications: "",
      photo_url: d.image || null,
      profile_url: d.profileUrl || null,
      gender: "",
      expertise: [],
      appointment_url: null,
      telephone: "",
      experience_years: null,
      about: null,
      is_featured: false,
    };
  }));
}

async function seed() {
  console.log("=== MedSolution Healthcare Doctor Seeder ===\n");

  const loaders = [
    { name: "Apollo",  loader: loadApollo,  key: "apollo-hospitals-delhi" },
    { name: "Max",     loader: loadMax,     key: "max-super-speciality-hospital-saket" },
    { name: "BLK",     loader: loadBlk,     key: "blk-max-super-speciality-hospital" },
    { name: "Medanta", loader: loadMedanta, key: "medanta-the-medicity" },
    { name: "Artemis", loader: loadArtemis, key: "artemis-hospital-gurugram" },
    { name: "Paras",   loader: loadParas,   key: "paras-hospital-gurugram" },
  ];

  let totalInserted = 0;
  let totalErrors = 0;

  for (const { name, loader, key } of loaders) {
    const hInfo = HOSPITAL_MAP[key];
    const doctors = loader(hInfo.id);
    console.log(`\n${name}: ${doctors.length} doctors`);

    // Upsert in batches of 100
    for (let i = 0; i < doctors.length; i += 100) {
      const batch = doctors.slice(i, i + 100);
      const { error } = await supabase.from("doctors").upsert(batch, {
        onConflict: "slug",
        ignoreDuplicates: false,
      });
      if (error) {
        console.error(`  Batch ${i / 100 + 1} error: ${error.message}`);
        totalErrors++;
      } else {
        totalInserted += batch.length;
      }
    }
    console.log(`  Inserted/Updated: ${doctors.length}`);
  }

  const { count } = await supabase
    .from("doctors")
    .select("*", { count: "exact", head: true });

  console.log(`\n=== Seed Complete ===`);
  console.log(`Total upserted: ${totalInserted}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Total in DB: ${count ?? "unknown"}`);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
