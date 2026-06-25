import { readFileSync, writeFileSync } from "fs";

let text = readFileSync("lib/fallback-data.ts", "utf-8");

const afterMap = text.indexOf("}));\n");
const hospitalsStart = text.indexOf("\nexport const fallbackHospitals");

if (afterMap > -1 && hospitalsStart > afterMap) {
  const before = text.substring(0, afterMap + 5); // +5 for "}));\n" -> 5 chars
  const after = text.substring(hospitalsStart);
  text = before + after;
  writeFileSync("lib/fallback-data.ts", text, "utf-8");
  console.log("File cleaned. New length:", text.length);
} else {
  console.log("Could not find markers", { afterMap, hospitalsStart });
}
