import { allDoctors } from "../lib/doctors-data";

const slugMap: Record<string, string[]> = {};
for (const d of allDoctors) {
  if (!slugMap[d.slug]) slugMap[d.slug] = [];
  slugMap[d.slug].push(d.name);
}

const dupes = Object.entries(slugMap).filter(([, v]) => v.length > 1);
console.log("Total doctors:", allDoctors.length);
console.log("Unique slugs:", Object.keys(slugMap).length);
console.log("Duplicate slugs:", dupes.length);

for (const [slug, names] of dupes.slice(0, 20)) {
  console.log(`  "${slug}" → [${names.join(", ")}]`);
}

if (dupes.length > 20) {
  console.log(`  ... and ${dupes.length - 20} more`);
}
