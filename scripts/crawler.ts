import * as fs from "fs";
import * as path from "path";

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
const DRY_RUN = process.argv.includes("--dry-run");

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function fetchPage(url: string): Promise<string> {
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SatyugCrawler/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function extractHospitals(html: string): HospitalData[] {
  const hospitals: HospitalData[] = [];
  const nameRegex = /<h[23][^>]*>([^<]+)<\/h[23]>/gi;
  const cityRegex = /(?:New\s*Delhi|Gurugram|Noida|Faridabad|Ghaziabad|Mumbai|Bangalore|Chennai|Hyderabad|Kolkata)/gi;

  const lines = html.split("\n");
  let currentName = "";

  for (const line of lines) {
    const nameMatch = nameRegex.exec(line);
    if (nameMatch) {
      const candidate = nameMatch[1].trim();
      if (candidate.length > 5 && !candidate.includes("Menu") && !candidate.includes("Login")) {
        currentName = candidate;
      }
    }
    const cityMatch = cityRegex.exec(line);
    if (cityMatch && currentName) {
      hospitals.push({
        name: currentName,
        city: cityMatch[0],
        slug: slugify(currentName),
      });
      currentName = "";
    }
  }

  return hospitals;
}

function extractDoctors(html: string): DoctorData[] {
  const doctors: DoctorData[] = [];
  const nameRegex = /(?:Dr\.?\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g;
  const specialtyKeywords = [
    "Cardiolog", "Neurolog", "Orthoped", "Oncolog", "Surgeon", "Nephrolog",
    "Urolog", "Gastroenterolog", "Ophthalmolog", "Dermatolog", "Psychiatr",
    "Endocrinolog", "Pulmonolog", "Rheumatolog", "Hematolog", "Radiolog",
    "Anesthesiolog", "Patholog", "Pediatric", "Gynecolog", "ENT", "Spine",
  ];

  const lines = html.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const nameMatch = nameRegex.exec(lines[i]);
    if (nameMatch) {
      const name = nameMatch[1].trim();
      if (name.length < 6) continue;
      if (name.includes("Menu") || name.includes("Home") || name.includes("About")) continue;

      const context = lines.slice(Math.max(0, i - 2), i + 4).join(" ").toLowerCase();
      const specialty =
        specialtyKeywords.find((sk) => context.includes(sk.toLowerCase())) || "General";

      const contextUpper = lines.slice(Math.max(0, i - 2), i + 4).join(" ");
      const hospitalMatch = contextUpper.match(/(?:at|from|at the)\s+([A-Z][A-Za-z\s]+?)(?:\s+[A-Z][a-z]+|\s*$)/);
      const hospital = hospitalMatch ? hospitalMatch[1].trim() : "General Hospital";

      doctors.push({
        name: name.startsWith("Dr. ") ? name : `Dr. ${name}`,
        specialty: specialty,
        hospital,
        slug: slugify(name),
      });
    }
  }

  return doctors;
}

function extractTreatments(html: string): TreatmentData[] {
  const treatments: TreatmentData[] = [];
  const treatmentNames = [
    "Knee Replacement", "Hip Replacement", "Heart Bypass", "Angioplasty",
    "Spine Surgery", "Cataract Surgery", "Dental Implants", "Hair Transplant",
    "IVF Treatment", "Bariatric Surgery", "Liver Transplant", "Kidney Transplant",
    "Bone Marrow Transplant", "Robotic Prostate Surgery", "Cosmetic Surgery",
  ];

  const costRegex = /\$(\d{1,3}(?:,\d{3})*)\s*(?:-|to)\s*\$?(\d{1,3}(?:,\d{3})*)/gi;

  const text = html.replace(/<[^>]+>/g, " ");
  for (const name of treatmentNames) {
    if (text.toLowerCase().includes(name.toLowerCase())) {
      const slug = slugify(name);
      let costMin = 0;
      let costMax = 0;

      const nameIndex = text.indexOf(name);
      if (nameIndex >= 0) {
        const nearby = text.substring(nameIndex, nameIndex + 500);
        const costMatch = costRegex.exec(nearby);
        if (costMatch) {
          costMin = parseInt(costMatch[1].replace(/,/g, ""));
          costMax = parseInt(costMatch[2].replace(/,/g, ""));
        }
      }

      const categoryMap: Record<string, string> = {
        "Knee Replacement": "Orthopedics",
        "Hip Replacement": "Orthopedics",
        "Heart Bypass": "Cardiology",
        Angioplasty: "Cardiology",
        "Spine Surgery": "Neurology",
        "Cataract Surgery": "Ophthalmology",
        "Dental Implants": "Dental",
        "Hair Transplant": "Cosmetic",
        "IVF Treatment": "Fertility",
        "Bariatric Surgery": "Gastroenterology",
        "Liver Transplant": "Transplant",
        "Kidney Transplant": "Transplant",
        "Bone Marrow Transplant": "Oncology",
        "Robotic Prostate Surgery": "Urology",
        "Cosmetic Surgery": "Cosmetic",
      };

      treatments.push({
        name,
        category: categoryMap[name] || "General",
        costMin: costMin || getDefaultCostMin(name),
        costMax: costMax || getDefaultCostMax(name),
        slug,
      });
    }
  }

  return treatments;
}

function getDefaultCostMin(name: string): number {
  const costs: Record<string, number> = {
    "Knee Replacement": 6500, "Hip Replacement": 7000, "Heart Bypass": 7000,
    Angioplasty: 3500, "Spine Surgery": 8000, "Cataract Surgery": 900,
    "Dental Implants": 800, "Hair Transplant": 2000, "IVF Treatment": 3000,
    "Bariatric Surgery": 5000, "Liver Transplant": 28000, "Kidney Transplant": 14000,
    "Bone Marrow Transplant": 18000, "Robotic Prostate Surgery": 6500, "Cosmetic Surgery": 3000,
  };
  return costs[name] || 5000;
}

function getDefaultCostMax(name: string): number {
  const costs: Record<string, number> = {
    "Knee Replacement": 8500, "Hip Replacement": 9500, "Heart Bypass": 10000,
    Angioplasty: 6500, "Spine Surgery": 12000, "Cataract Surgery": 2500,
    "Dental Implants": 3000, "Hair Transplant": 4000, "IVF Treatment": 6000,
    "Bariatric Surgery": 7500, "Liver Transplant": 45000, "Kidney Transplant": 22000,
    "Bone Marrow Transplant": 35000, "Robotic Prostate Surgery": 9500, "Cosmetic Surgery": 8000,
  };
  return costs[name] || 10000;
}

async function crawl() {
  console.log("=== Satyug Healthcare Crawler ===\n");

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Crawl hospitals page
  console.log("1. Crawling hospitals...");
  let hospitals: HospitalData[] = [];
  try {
    const html = await fetchPage("https://satyughealthcare.com/hospitals");
    hospitals = extractHospitals(html);
    console.log(`   Found ${hospitals.length} hospitals`);
  } catch (err) {
    console.error(`   Error: ${err}`);
  }

  // Crawl doctors page
  console.log("\n2. Crawling doctors...");
  let doctors: DoctorData[] = [];
  try {
    const html = await fetchPage("https://satyughealthcare.com/doctors");
    doctors = extractDoctors(html);
    console.log(`   Found ${doctors.length} doctors`);
  } catch (err) {
    console.error(`   Error: ${err}`);
  }

  // Crawl treatments
  console.log("\n3. Crawling treatments...");
  let treatments: TreatmentData[] = [];
  try {
    const html = await fetchPage("https://satyughealthcare.com/treatments");
    treatments = extractTreatments(html);
    console.log(`   Found ${treatments.length} treatments`);
  } catch (err) {
    console.error(`   Error: ${err}`);
  }

  if (DRY_RUN) {
    console.log("\n=== DRY RUN - No files written ===\n");
    console.log("Hospitals:", JSON.stringify(hospitals, null, 2));
    console.log("\nDoctors:", JSON.stringify(doctors, null, 2));
    console.log("\nTreatments:", JSON.stringify(treatments, null, 2));
    process.exit(0);
  }

  // Write to JSON files
  fs.writeFileSync(
    path.join(DATA_DIR, "hospitals.json"),
    JSON.stringify(hospitals, null, 2)
  );
  fs.writeFileSync(
    path.join(DATA_DIR, "doctors.json"),
    JSON.stringify(doctors, null, 2)
  );
  fs.writeFileSync(
    path.join(DATA_DIR, "treatments.json"),
    JSON.stringify(treatments, null, 2)
  );

  // Write combined data
  const allData = { hospitals, doctors, treatments, crawledAt: new Date().toISOString() };
  fs.writeFileSync(
    path.join(DATA_DIR, "all-data.json"),
    JSON.stringify(allData, null, 2)
  );

  console.log(`\n=== Crawl Complete ===`);
  console.log(`Data saved to ${DATA_DIR}`);
  console.log(`  Hospitals: ${hospitals.length}`);
  console.log(`  Doctors: ${doctors.length}`);
  console.log(`  Treatments: ${treatments.length}`);
}

crawl().catch(console.error);
