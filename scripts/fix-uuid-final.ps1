$content = Get-Content "supabase/migrations/002_seed_delhi_data.sql" -Raw

# Fix specialties: s0000001-... -> c0000001-... (for all 12 UUIDs 001-012)
for ($i = 1; $i -le 12; $i++) {
  $num = $i.ToString("D3")
  $content = $content.Replace("s0000001-0000-0000-0000-000000000$num", "c0000001-0000-0000-0000-000000000$num")
}

# Fix treatments: t0000001-... -> d0000001-... (for 14 UUIDs 001-014)
for ($i = 1; $i -le 14; $i++) {
  $num = $i.ToString("D3")
  $content = $content.Replace("t0000001-0000-0000-0000-000000000$num", "d0000001-0000-0000-0000-000000000$num")
}

# Fix insurance: i0000001-... -> e0000001-... (for 8 UUIDs 001-008)
for ($i = 1; $i -le 8; $i++) {
  $num = $i.ToString("D3")
  $content = $content.Replace("i0000001-0000-0000-0000-000000000$num", "e0000001-0000-0000-0000-000000000$num")
}

# Fix testimonials: r0000001-... -> f0000001-... (for 8 UUIDs 001-008)
for ($i = 1; $i -le 8; $i++) {
  $num = $i.ToString("D3")
  $content = $content.Replace("r0000001-0000-0000-0000-000000000$num", "f0000001-0000-0000-0000-000000000$num")
}

# Fix hotels: h0000001-... -> 80000001-... (for 10 UUIDs 001-010)
for ($i = 1; $i -le 10; $i++) {
  $num = $i.ToString("D3")
  $content = $content.Replace("h0000001-0000-0000-0000-000000000$num", "80000001-0000-0000-0000-000000000$num")
}

Set-Content "supabase/migrations/002_seed_delhi_data.sql" $content
Write-Host "All UUIDs fixed to use only hex characters" -ForegroundColor Green
