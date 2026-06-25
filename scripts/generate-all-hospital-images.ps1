param(
  [string]$ApiKey = "",
  [int]$StartIndex = 0,
  [int]$MaxImages = 999
)

if ([string]::IsNullOrEmpty($ApiKey)) {
  $envPath = Join-Path (Split-Path $PSScriptRoot -Parent) ".env.local"
  if (Test-Path $envPath) {
    $line = Get-Content $envPath | Where-Object { $_ -match 'NVIDIA_API_KEY=' } | Select-Object -First 1
    if ($line) { $ApiKey = $line -replace '.*NVIDIA_API_KEY=(.*)', '$1' }
  }
}

if ([string]::IsNullOrEmpty($ApiKey)) {
  Write-Host "ERROR: No NVIDIA_API_KEY found. Set parameter or add to .env.local" -ForegroundColor Red
  exit 1
}

$ApiUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"
$OutputDir = Join-Path (Split-Path $PSScriptRoot -Parent) "public\images"

Write-Host "Using API Key: $($ApiKey.Substring(0,10))..." -ForegroundColor Green
Write-Host "Output dir: $OutputDir`n" -ForegroundColor Green

# ─── All 17 Hospitals with enhanced, location-specific prompts ─────────────
$images = @(
  @{ file="hospital-medanta.webp";    prompt="Medanta The Medicity hospital exterior Gurugram India, award-winning 1250-bed multi-specialty medical city, 45+ operating theatres, modern glass and steel facade with prominent Medanta signage, lush green campus landscaping, palm trees, wide entrance driveway, blue sky with white clouds, professional architectural photography, bright sunny day, photorealistic 8K" }

  @{ file="hospital-apollo.webp";     prompt="Apollo Hospitals Indraprastha main building exterior New Delhi India, flagship 700-bed tertiary care hospital, iconic white and blue glass facade, prominent Apollo signage, green portico entrance with columns, well-maintained lawns, bright blue sky, professional healthcare architectural photography, daylight" }

  @{ file="hospital-fortis-escorts.webp"; prompt="Fortis Escorts Heart Institute exterior Okhla New Delhi, India's most recognised cardiac hospital 485 beds, modern glass and concrete facade with prominent Fortis signage, blue sky, clean professional hospital architecture, bright sunny day photography" }

  @{ file="hospital-max-saket.webp";  prompt="Max Super Speciality Hospital Saket exterior New Delhi, 680-bed multi-specialty hospital, large modern glass and steel complex, prominent Max Healthcare signage, green landscaping, clear blue sky, professional architectural healthcare photography" }

  @{ file="hospital-ganga-ram.webp";  prompt="Sir Ganga Ram Hospital exterior Rajendra Place New Delhi, premier 650-bed multi-specialty hospital, 70-year legacy, cream and white modern facade with glass wings, established medical institution look, blue sky, professional photography" }

  @{ file="hospital-blk-max.webp";     prompt="BLK-Max Super Speciality Hospital Pusa Road New Delhi, 650-bed leading healthcare facility, modern glass facade with prominent BLK Max signage, 17 super-speciality departments, clean medical architecture, blue sky, professional hospital exterior photography" }

  @{ file="hospital-artemis.webp";    prompt="Artemis Hospital Gurugram Haryana, JCI-accredited 500-bed state-of-the-art multi-specialty hospital, distinctive curved modern glass and steel building, green landscaping, blue sky, professional architectural healthcare photography, bright daylight" }

  @{ file="hospital-fmri.webp";       prompt="Fortis Memorial Research Institute FMRI Gurugram, flagship 1000-bed quaternary care hospital, massive modern glass facade with Fortis signage, helipad visible on rooftop, green campus surroundings, professional architectural photography" }

  @{ file="hospital-manipal-dwarka.webp"; prompt="Manipal Hospital Dwarka New Delhi, 380-bed multi-specialty tertiary care hospital, modern glass and concrete building facade, Manipal Healthcare signage, clean architectural design, West Delhi medical facility, blue sky, professional photography" }

  @{ file="hospital-isic.webp";       prompt="Indian Spinal Injuries Centre Vasant Kunj New Delhi, Asia's premier spine care and rehabilitation institute, modern medical facility with 250 beds, clean glass facade, NABH accredited specialized hospital, professional clinical architectural photography" }

  @{ file="hospital-venkateshwar.webp"; prompt="Venkateshwar Hospital Dwarka New Delhi, 350-bed multi-super-speciality hospital, modern glass and concrete building, clean contemporary medical architecture, professional hospital exterior photography, blue sky" }

  @{ file="hospital-saroj.webp";      prompt="Saroj Super Speciality Hospital Central Delhi, 300-bed well-established medical facility, modern multi-story hospital building with clean facade design, NABH accredited, professional healthcare photography, bright daylight" }

  @{ file="hospital-paras.webp";      prompt="Paras Hospital Gurugram Haryana, 350-bed multi-specialty tertiary care hospital, modern glass facade building with Paras Healthcare signage, clean professional architecture, blue sky, bright sunny day photography" }

  @{ file="hospital-narayana.webp";   prompt="Narayana Superspeciality Hospital Gurugram, 450-bed affordable cardiac care hospital part of Narayana Health chain, modern healthcare building facade, professional medical architecture photography, blue sky" }

  @{ file="hospital-moolchand.webp";  prompt="Moolchand Hospital South Delhi, 325-bed multi-specialty hospital with 70-year legacy, established medical institution facade, clean clinical architecture, professional hospital exterior photography, bright daylight" }

  @{ file="hospital-columbia-asia.webp"; prompt="Columbia Asia Hospital Gurugram Haryana, JCI-accredited 200-bed international standard hospital, clean modern glass facade, professional healthcare architecture, blue sky, professional photography" }

  # AIIMS is not in fallbackHospitals array but has an image, keep for completeness
  @{ file="hospital-aiims.webp";     prompt="All India Institute of Medical Sciences AIIMS main building exterior New Delhi India, India's premier medical institute, large modern hospital complex, green campus, blue sky with clouds, professional architectural photography, bright daylight, photorealistic 8K" }
)

$total = [Math]::Min($images.Count, $StartIndex + $MaxImages)
$success = 0; $failed = 0

for ($i = $StartIndex; $i -lt $total; $i++) {
  $img = $images[$i]
  $filepath = Join-Path $OutputDir $img.file
  $prompt = $img.prompt

  if (Test-Path $filepath) {
    Write-Host "[$($i+1)/$($images.Count)] $($img.file) already exists, skipping..." -ForegroundColor Yellow
    $success++
    continue
  }

  Write-Host "[$($i+1)/$($images.Count)] Generating $($img.file)..."

  $body = @{
    prompt = $prompt
    width = 1024
    height = 1024
    steps = 4
    seed = 0
  } | ConvertTo-Json

  try {
    $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Headers @{
      Authorization = "Bearer $ApiKey"
      "Content-Type" = "application/json"
      Accept = "application/json"
    } -Body $body

    $base64 = $response.artifacts[0].base64
    $bytes = [Convert]::FromBase64String($base64)
    [IO.File]::WriteAllBytes($filepath, $bytes)

    Write-Host "  -> Saved $($img.file) ($($bytes.Length/1024 -as [int]) KB)" -ForegroundColor Green
    $success++
  }
  catch {
    Write-Host "  -> FAILED: $_" -ForegroundColor Red
    $failed++
    $errorMsg = $_.Exception.Message
    if ($errorMsg -match '\{.*\}') {
      Write-Host "  -> Response: $($Matches[0])" -ForegroundColor Yellow
    }
  }

  Start-Sleep -Milliseconds 200
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan
Write-Host "Generated/Skipped: $success" -ForegroundColor Green
if ($failed -gt 0) { Write-Host "Failed: $failed" -ForegroundColor Red }
Write-Host "Destination: $OutputDir" -ForegroundColor Cyan
