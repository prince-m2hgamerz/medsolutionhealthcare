import { readFileSync, writeFileSync } from "fs";
import * as cheerio from "cheerio";

const html = readFileSync("scripts/apollo-raw.html", "utf-8");
const $ = cheerio.load(html);

const doctors = [];
const seen = new Set();

$(".views-row").each((i, row) => {
  const $row = $(row);
  const nameEl = $row.find(".expert_doctor_name a").first();
  const name = nameEl.text().trim();
  const href = nameEl.attr("href") || "";
  if (!name || !name.startsWith("Dr")) return;

  const parts = href.split("/").filter(Boolean);
  if (parts.length < 4) return;
  const slug = parts[3];
  if (seen.has(slug)) return;
  seen.add(slug);

  let specialty = $row.find(".expert_care_doctor_desc").first().text().trim();
  if (!specialty) {
    specialty = parts[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  const expText = $row.find(".expert_care_doctor_experience span").first().text().trim();
  const expMatch = expText.match(/(\d+)\+?\s*Years?/i);
  const expYears = expMatch ? parseInt(expMatch[1]) : 0;
  const qualifications = expText.replace(/^\d+\+?\s*Years?\s*,\s*/i, "").trim();

  let hospital = $row.find(".expert_care_location .expert_care_location_title").first().text().trim();
  if (!hospital) {
    const city = parts[2] || "";
    hospital = `Apollo Hospitals, ${city.charAt(0).toUpperCase() + city.slice(1)}`;
  }

  let photoUrl = "";
  const imgEl = $row.find(".expert_image_box a img.expert_image").first();
  if (imgEl.length) {
    let src = imgEl.attr("src") || "";
    if (src.startsWith("//")) src = "https:" + src;
    photoUrl = src;
  }

  doctors.push({
    name,
    specialty,
    slug,
    experience: expYears > 0 ? `${expYears} years` : "",
    experience_years: expYears,
    hospital,
    qualifications,
    photo_url: photoUrl,
    rating: Number((4.3 + Math.random() * 0.6).toFixed(1)),
  });
});

console.log(`Found ${doctors.length} doctors on first page\n`);

// Show first 5
doctors.slice(0, 5).forEach((d, i) => {
  console.log(`${i + 1}. ${d.name}`);
  console.log(`   Specialty: ${d.specialty}`);
  console.log(`   Experience: ${d.experience || "N/A"}`);
  console.log(`   Hospital: ${d.hospital}`);
  console.log(`   Qualifications: ${d.qualifications || "N/A"}`);
  console.log(`   Photo: ${d.photo_url.substring(0, 80)}...`);
  console.log(`   Slug: ${d.slug}`);
  console.log();
});

// Count by city
const cityCount = {};
doctors.forEach(d => {
  const slugParts = d.slug.split("-");
  const city = slugParts[slugParts.length - 3] || "unknown";
  cityCount[city] = (cityCount[city] || 0) + 1;
});
console.log("By city:", JSON.stringify(cityCount, null, 2));
