$content = Get-Content "supabase/migrations/002_seed_delhi_data.sql" -Raw

# Fix UUID prefixes to use only hex chars (0-9, a-f)
# s -> c (specialties)
$content = $content.Replace("s0000001-0000-0000-0000-00000000000", "c0000001-0000-0000-0000-00000000000")
# t -> d (treatments)
$content = $content.Replace("t0000001-0000-0000-0000-00000000000", "d0000001-0000-0000-0000-00000000000")
# i -> e (insurance)
$content = $content.Replace("i0000001-0000-0000-0000-00000000000", "e0000001-0000-0000-0000-00000000000")
# r -> f (testimonials)
$content = $content.Replace("r0000001-0000-0000-0000-00000000000", "f0000001-0000-0000-0000-00000000000")

Set-Content "supabase/migrations/002_seed_delhi_data.sql" $content
Write-Host "Fixed UUIDs to use only hex chars" -ForegroundColor Green
