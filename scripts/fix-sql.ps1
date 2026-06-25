$content = Get-Content "supabase/migrations/002_seed_delhi_data.sql" -Raw
# Replace backslash-single-quote with double-single-quote
$content = $content.Replace("\'", "''")
# Also handle bare single quotes inside strings (like Parkinson's)
$content = $content.Replace("Parkinson's", "Parkinson''s")
Set-Content "supabase/migrations/002_seed_delhi_data.sql" $content
Write-Host "Fixed SQL escaping" -ForegroundColor Green
