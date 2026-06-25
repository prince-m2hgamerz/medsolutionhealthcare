/**
 * generate-doctors-data.mjs
 * Reads all 6 hospital JSON files → writes lib/doctors-data.ts
 *
 * Field mapping per source:
 *   Apollo    → image, url, telephone     (gender mostly empty)
 *   Max       → image, url, telephone     (gender populated, malformed JSON)
 *   BLK-Max   → imageUrl, profileUrl, appointmentUrl
 *   Medanta   → profileUrl, appointmentUrl (richest: expertise, qualifications, locations)
 *   Artemis   → profile                   (only /doctor/profile/ entries, name from slug)
 *   Paras     → image, profileUrl
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = join(__dir, "..");
const src   = join(root, "doctorsjsondata");

// ── helpers ──────────────────────────────────────────────────────────────────

function toSlug(name, suffix) {
  return name
    .toLowerCase()
    .replace(/^(dr\.?|prof\.?|prof\s+\(dr\.\)|\(prof\.\)|col\.?)\s+/gi, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") +
    "-" + suffix;
}

function cleanSpecialty(raw) {
  if (!raw) return "";
  return raw.replace(/&amp;/g, "&").split(",")[0].trim();
}

/** Strip query params, reject generic placeholder images */
function cleanImg(url) {
  if (!url || typeof url !== "string") return null;
  const u = url.split("?")[0].trim();
  if (!u) return null;
  if (
    u.includes("defaultprofilepic") ||
    u.includes("defaultprofile") ||
    u.includes("Dummy_pic")
  ) return null;
  return u;
}

function row(d) {
  return `  { name:${j(d.name)}, slug:${j(d.slug)}, specialty:${j(d.specialty)}, hospital:${j(d.hospital)}, hospitalSlug:${j(d.hospitalSlug)}, designation:${j(d.designation)}, qualifications:${j(d.qualifications)}, photo_url:${d.photo_url ? j(d.photo_url) : "null"}, profileUrl:${d.profileUrl ? j(d.profileUrl) : "null"}, gender:${j(d.gender)}, expertise:${JSON.stringify(d.expertise)}, appointmentUrl:${d.appointmentUrl ? j(d.appointmentUrl) : "null"}, telephone:${j(d.telephone)} },`;
}
const j = JSON.stringify;

// ── 1. APOLLO  (field: image, url) ───────────────────────────────────────────

const apolloRaw = JSON.parse(readFileSync(join(src, "apollo.json"), "utf8"));
const apolloDoctors = apolloRaw.map(d => ({
  name:        d.name,
  slug:        toSlug(d.name, "apollo"),
  specialty:   cleanSpecialty(d.medicalSpecialty),
  hospital:    "Apollo Hospitals Indraprastha",
  hospitalSlug:"apollo-hospitals-delhi",
  designation: d.medicalSpecialty ? d.medicalSpecialty.replace(/&amp;/g, "&") : "",
  qualifications: "",
  photo_url:   cleanImg(d.image),          // ← "image" field
  profileUrl:  d.url  || null,             // ← "url" field
  gender:      d.gender || "",
  expertise:   [],
  appointmentUrl: null,
  telephone:   d.telephone || "",
}));
console.log(`Apollo:   ${apolloDoctors.length}  (images: ${apolloDoctors.filter(x=>x.photo_url).length})`);

// ── 2. MAX  (field: image, url — malformed outer {}) ─────────────────────────

const maxText = readFileSync(join(src, "max.json"), "utf8").trim();
// File is: { {...} , {...} }  →  strip outer braces, wrap in []
const maxInner = maxText.slice(1, maxText.lastIndexOf("}"));
const maxRaw   = JSON.parse("[" + maxInner + "]");

const maxDoctors = maxRaw.map(d => ({
  name:        d.name,
  slug:        toSlug(d.name, "max"),
  specialty:   cleanSpecialty(d.medicalSpecialty),
  hospital:    "Max Super Speciality Hospital Saket",
  hospitalSlug:"max-super-speciality-hospital-saket",
  designation: d.medicalSpecialty ? d.medicalSpecialty.replace(/&amp;/g, "&") : "",
  qualifications: "",
  photo_url:   cleanImg(d.image),          // ← "image" field
  profileUrl:  d.url  || null,             // ← "url" field
  gender:      d.gender || "",
  expertise:   [],
  appointmentUrl: null,
  telephone:   d.telephone || "",
}));
console.log(`Max:      ${maxDoctors.length}  (images: ${maxDoctors.filter(x=>x.photo_url).length})`);

// ── 3. BLK-MAX  (field: imageUrl, profileUrl) ────────────────────────────────

const blkRaw = JSON.parse(readFileSync(join(src, "blkmax_doctors.json"), "utf8"));
const blkDoctors = blkRaw.map(d => ({
  name:        d.name,
  slug:        toSlug(d.name, "blk"),
  specialty:   d.specialities?.length ? d.specialities[d.specialities.length - 1] : "",
  hospital:    "BLK-Max Super Speciality Hospital",
  hospitalSlug:"blk-max-super-speciality-hospital",
  designation: d.designation || "",
  qualifications: "",
  photo_url:   cleanImg(d.imageUrl),       // ← "imageUrl" field
  profileUrl:  d.profileUrl || null,       // ← "profileUrl" field
  gender:      "",
  expertise:   d.specialities || [],
  appointmentUrl: d.appointmentUrl || null,
  telephone:   "",
}));
console.log(`BLK-Max:  ${blkDoctors.length}  (images: ${blkDoctors.filter(x=>x.photo_url).length})`);

// ── 4. MEDANTA  (NO image field in JSON — construct from profileUrl slug) ─────
// Profile pages embed: image → https://medanta.s3.ap-south-1.amazonaws.com/all-doctor-with-slug/{slug}.png
// ~47% of slugs resolve to valid images; the rest fall back to initials in the UI.

const MEDANTA_IMG_BASE = "https://medanta.s3.ap-south-1.amazonaws.com/all-doctor-with-slug";

const medantaRaw = JSON.parse(readFileSync(join(src, "medanta_doctors.json"), "utf8"));
const medantaDoctors = medantaRaw.map(d => {
  const slug = d.profileUrl ? d.profileUrl.split("/").filter(Boolean).pop() : null;
  const photo = slug ? `${MEDANTA_IMG_BASE}/${slug}.png` : null;
  return {
    name:        d.name,
    slug:        toSlug(d.name, "medanta"),
    specialty:   d.speciality || "",
    hospital:    "Medanta - The Medicity",
    hospitalSlug:"medanta-the-medicity",
    designation: d.designation || "",
    qualifications: Array.isArray(d.qualifications) ? d.qualifications.join(", ") : (d.qualifications || ""),
    photo_url:   photo,                     // ← constructed from profileUrl slug
    profileUrl:  d.profileUrl || null,       // ← "profileUrl" field
    gender:      "",
    expertise:   Array.isArray(d.expertise) ? d.expertise : [],
    appointmentUrl: d.appointmentUrl || null,
    telephone:   "",
  };
});
console.log(`Medanta:  ${medantaDoctors.length}  (images: ${medantaDoctors.filter(x=>x.photo_url).length} — constructed from profileUrl slugs)`);

// ── 5. ARTEMIS  (NO image field — profile URL only) ──────────────────────────
// Only entries where "profile" contains /doctor/profile/ are real doctors.
// Category nav entries (Cardiologist, BMT Specialist, etc.) are skipped.

const artemisRaw = JSON.parse(readFileSync(join(src, "artemis.json"), "utf8"));

function nameFromProfileSlug(slug) {
  return "Dr. " + slug
    .replace(/^dr-/, "")
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const artemisDoctors = artemisRaw
  .filter(d => typeof d.profile === "string" && d.profile.includes("/doctor/profile/"))
  .map(d => {
    const slug = d.profile.split("/").filter(Boolean).pop() || "";
    // Image URL pattern discovered from JSON-LD on Artemis specialty listing pages
    const imgSlug = slug.replace(/^dr-/i, "");
    return {
      name:        nameFromProfileSlug(slug),
      slug:        slug + "-artemis",
      specialty:   "Specialist",
      hospital:    "Artemis Hospital Gurugram",
      hospitalSlug:"artemis-hospital-gurugram",
      designation: "Consultant",
      qualifications: "",
      photo_url:   `https://www.artemishospitals.com/BackEndImages/DoctorImage/dr-dr-${imgSlug}.jpg`,
      profileUrl:  d.profile,
      gender:      "",
      expertise:   [],
      appointmentUrl: null,
      telephone:   "",
    };
  });
console.log(`Artemis:  ${artemisDoctors.length}  (images: ${artemisDoctors.filter(x=>x.photo_url).length} — constructed from profileUrl slugs)`);

// ── 6. PARAS  (field: image — already full URL, profileUrl) ──────────────────

const parasRaw = JSON.parse(readFileSync(join(src, "paras_doctors.json"), "utf8"));
const parasDoctors = parasRaw
  .filter(d => d.name && d.name.trim())
  .map(d => {
    const fullName = /^Dr\.?\s/i.test(d.name) ? d.name : "Dr. " + d.name;
    return {
      name:        fullName,
      slug:        toSlug(fullName, "paras"),
      specialty:   "Specialist",
      hospital:    "Paras Hospital Gurugram",
      hospitalSlug:"paras-hospital-gurugram",
      designation: "Consultant",
      qualifications: "",
      photo_url:   d.image || null,        // ← "image" field (full URL already)
      profileUrl:  d.profileUrl || null,   // ← "profileUrl" field
      gender:      "",
      expertise:   [],
      appointmentUrl: null,
      telephone:   "",
    };
  });
console.log(`Paras:    ${parasDoctors.length}  (images: ${parasDoctors.filter(x=>x.photo_url).length})`);

// ── WRITE FILE ────────────────────────────────────────────────────────────────

const all = [
  ...apolloDoctors,
  ...maxDoctors,
  ...blkDoctors,
  ...medantaDoctors,
  ...artemisDoctors,
  ...parasDoctors,
];

console.log(`\nTOTAL: ${all.length} doctors`);
console.log(`With images: ${all.filter(x=>x.photo_url).length}`);
console.log(`Without images (initials fallback): ${all.filter(x=>!x.photo_url).length}`);

const ts = `// AUTO-GENERATED — run: node scripts/generate-doctors-data.mjs
// Sources: Apollo | Max | BLK | Medanta | Artemis | Paras

export interface Doctor {
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
  expertise: string[];
  telephone: string;
}

// ─── Apollo Hospitals Indraprastha (${apolloDoctors.length} doctors, ${apolloDoctors.filter(x=>x.photo_url).length} with photos) ──
const apolloDoctors: Doctor[] = [
${apolloDoctors.map(row).join("\n")}
];

// ─── Max Super Speciality Hospital Saket (${maxDoctors.length} doctors, ${maxDoctors.filter(x=>x.photo_url).length} with photos) ──
const maxDoctors: Doctor[] = [
${maxDoctors.map(row).join("\n")}
];

// ─── BLK-Max Super Speciality Hospital (${blkDoctors.length} doctors, ${blkDoctors.filter(x=>x.photo_url).length} with photos) ──
const blkDoctors: Doctor[] = [
${blkDoctors.map(row).join("\n")}
];

// ─── Medanta - The Medicity (${medantaDoctors.length} doctors, 0 photos in source JSON) ──
const medantaDoctors: Doctor[] = [
${medantaDoctors.map(row).join("\n")}
];

// ─── Artemis Hospital Gurugram (${artemisDoctors.length} doctors, 0 photos in source JSON) ──
const artemisDoctors: Doctor[] = [
${artemisDoctors.map(row).join("\n")}
];

// ─── Paras Hospital Gurugram (${parasDoctors.length} doctors, ${parasDoctors.filter(x=>x.photo_url).length} with photos) ──
const parasDoctors: Doctor[] = [
${parasDoctors.map(row).join("\n")}
];

export const allDoctors: Doctor[] = [
  ...apolloDoctors,
  ...maxDoctors,
  ...blkDoctors,
  ...medantaDoctors,
  ...artemisDoctors,
  ...parasDoctors,
];

export const HOSPITALS = [
  { name: "Apollo Hospitals Indraprastha",        slug: "apollo-hospitals-delhi" },
  { name: "Max Super Speciality Hospital Saket",  slug: "max-super-speciality-hospital-saket" },
  { name: "BLK-Max Super Speciality Hospital",    slug: "blk-max-super-speciality-hospital" },
  { name: "Medanta - The Medicity",               slug: "medanta-the-medicity" },
  { name: "Artemis Hospital Gurugram",            slug: "artemis-hospital-gurugram" },
  { name: "Paras Hospital Gurugram",              slug: "paras-hospital-gurugram" },
] as const;

export const hospitalImageBySlug: Record<string, string> = {
  "apollo-hospitals-delhi":             "https://satyughealthcare.com/uploads/hospitals/1580542668_Indraprastha-Apollo-Hospital_icon-600x586.jpg",
  "max-super-speciality-hospital-saket":"https://satyughealthcare.com/uploads/hospitals/1709659199_Max_Hospital_Dwarka_Sector_10,_New_Delhi.jpg",
  "blk-max-super-speciality-hospital":  "https://crossborderscare.com/wp-content/uploads/2023/05/Blk-Max-hospital.jpg",
  "medanta-the-medicity":               "https://getwellgo.com/uploads/hospitals/medanta-gurgaon.jpg",
  "artemis-hospital-gurugram":          "https://www.globalcarehealth.com/img/hospitalsimg/Artemis-Hospital-Gurugram-India-gchh81.webp",
  "paras-hospital-gurugram":            "https://medicircle.in/uploads/2020/january2020/paras_hospital_edit.jpg",
  "aiims-delhi":                        "https://upload.wikimedia.org/wikipedia/commons/c/cd/AIIMS_-New_Delhi%27s_Ward_Block.jpg",
  "fortis-escorts-heart-institute":     "https://satyughealthcare.com/uploads/hospitals/1612249990_Fortis_escorts_jaipur.jpg",
  "sir-ganga-ram-hospital":             "https://www.joonsquare.com/usermanage/image/business/sir-ganga-ram-hospital-east-delhi-1160/sir-ganga-ram-hospital-east-delhi-ganga2.jpg",
  "fortis-memorial-research-institute": "https://satyughealthcare.com/uploads/hospitals/1636038339_fortis_hospital,_shalimar_bagh,_new_delhi,_delhi.jpg",
  "manipal-hospital-dwarka":            "https://satyughealthcare.com/uploads/hospitals/1591203905_Manipal_Hospital.jpg",
  "indian-spinal-injuries-centre":      "https://satyughealthcare.com/uploads/hospitals/1600550232_Indian_Spinal_Injuries_Center,_Vasant_Kunj_,_New_Delhi.jpg",
  "venkateshwar-hospital":              "https://satyughealthcare.com/uploads/hospitals/1609080986_venkateshwar-hospital,_dwarka_sector_18,_New_Delhi.jpg",
  "saroj-super-speciality-hospital":    "https://satyughealthcare.com/uploads/hospitals/1636038966_blk_max_super_speciality_hospital,_New_Delhi.jpg",
  "narayana-superspeciality-hospital-gurugram": "https://satyughealthcare.com/uploads/hospitals/1610359225_Narayana_Superspeciality_Hospital__Gurugram.jpg",
  "moolchand-hospital":                 "https://satyughealthcare.com/uploads/hospitals/1609996048_moolchand-medcity-hospital-sikandra-agra-hospitals-8xp1twzhgx.jpg",
  "columbia-asia-hospital-gurugram":    "https://satyughealthcare.com/uploads/hospitals/1636038848_columbia_asia_hospital_hebbal_bangalore.jpg",
};
`;

writeFileSync(join(root, "lib", "doctors-data.ts"), ts, "utf8");
console.log("\n✅ lib/doctors-data.ts written");
