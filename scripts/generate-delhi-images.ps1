param(
  [string]$ApiKey = "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",
  [int]$StartIndex = 0,
  [int]$MaxImages = 999
)

$ApiUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"
$OutputDir = "public\images"

$images = @(
  # ─── Hospital Exteriors (17) ─────────────────────────
  @{ file="hospital-aiims.webp"; prompt="All India Institute of Medical Sciences AIIMS main building exterior New Delhi, large modern hospital complex, green campus, blue sky with clouds, professional architectural photography, bright daylight, photorealistic, 8K" }
  @{ file="hospital-medanta.webp"; prompt="Medanta The Medicity hospital exterior Gurugram, modern glass facade multi-story building, blue sky, green landscaping, palm trees, professional architectural photography, bright sunny day, photorealistic 8K" }
  @{ file="hospital-apollo.webp"; prompt="Apollo Hospitals Indraprastha main entrance building exterior New Delhi, modern white and glass architecture, blue sky, portico entrance, professional hospital photography, bright daylight" }
  @{ file="hospital-fortis-escorts.webp"; prompt="Fortis Escorts Heart Institute building exterior Okhla New Delhi, modern hospital facade with glass panels, blue sky, professional architectural photography, bright sunny day" }
  @{ file="hospital-max-saket.webp"; prompt="Max Super Speciality Hospital Saket building exterior New Delhi, large modern hospital complex, glass steel architecture, blue sky, professional healthcare photography" }
  @{ file="hospital-ganga-ram.webp"; prompt="Sir Ganga Ram Hospital exterior building New Delhi, established hospital facade with modern wings, Rajendra Place area, clinical professional photography, blue sky" }
  @{ file="hospital-blk.webp"; prompt="BLK Max Super Speciality Hospital building exterior New Delhi, modern hospital with glass front, Pusa Road area, professional architectural photography, sunny day" }
  @{ file="hospital-artemis.webp"; prompt="Artemis Hospital Gurugram exterior view, modern curved glass building, green landscape, blue sky, professional hospital architectural photography, bright daylight" }
  @{ file="hospital-fmri.webp"; prompt="Fortis Memorial Research Institute FMRI exterior Gurugram, large modern hospital campus, glass and steel architecture, helipad visible, professional photography" }
  @{ file="hospital-manipal.webp"; prompt="Manipal Hospital Dwarka exterior building New Delhi, modern multi-story hospital facade, glass windows, blue sky, professional healthcare architectural photography" }
  @{ file="hospital-spinal.webp"; prompt="Indian Spinal Injuries Centre building exterior New Delhi, modern medical facility, Vasant Kunj area, professional clinical architectural photography, sunny day" }
  @{ file="hospital-venkateshwar.webp"; prompt="Venkateshwar Hospital Dwarka exterior New Delhi, modern hospital building facade, glass and concrete architecture, blue sky, professional photography" }
  @{ file="hospital-saroj.webp"; prompt="Saroj Super Speciality Hospital exterior New Delhi, modern hospital building, clean architectural design, professional healthcare photography, bright daylight" }
  @{ file="hospital-paras.webp"; prompt="Paras Hospital Gurugram exterior building, modern multi-specialty hospital facade, glass windows, professional architectural photography, sunny blue sky" }
  @{ file="hospital-narayana.webp"; prompt="Narayana Superspeciality Hospital Gurugram exterior, modern healthcare building, Narayana Health chain, professional hospital architectural photography" }
  @{ file="hospital-moolchand.webp"; prompt="Moolchand Hospital exterior New Delhi, established multi-specialty hospital building, South Delhi, professional clinical architectural photography" }
  @{ file="hospital-columbia.webp"; prompt="Columbia Asia Hospital Gurugram exterior, modern international standard hospital building, clean glass facade, professional architectural photography" }

  # ─── Doctor Portraits (17 featured) ──────────────────
  @{ file="doctor-sharma.webp"; prompt="professional portrait of Indian male senior cardiac surgeon in white coat and scrubs, stethoscope around neck, hospital setting, confident compassionate expression, professional medical headshot, soft lighting, photorealistic" }
  @{ file="doctor-trehan.webp"; prompt="distinguished portrait of elderly Indian male renowned cardiac surgeon in white coat, Padma Shri awardee, professional headshot, hospital background, wise confident look, soft lighting" }
  @{ file="doctor-singh.webp"; prompt="professional portrait of Indian female neurologist in white coat, stethoscope, modern hospital setting, confident intelligent expression, soft professional lighting, medical headshot" }
  @{ file="doctor-seth.webp"; prompt="professional portrait of distinguished Indian male cardiologist in white coat, senior doctor, hospital background, confident experienced look, soft studio lighting" }
  @{ file="doctor-kumar.webp"; prompt="professional portrait of Indian male oncology surgeon in white coat and scrubs, hospital background, confident and compassionate expression, medical headshot" }
  @{ file="doctor-prasad.webp"; prompt="professional portrait of Indian male senior neurologist in white coat, glasses, hospital consultation room background, intelligent composed expression, soft lighting" }
  @{ file="doctor-bohra.webp"; prompt="professional portrait of Indian male orthopedic surgeon in white coat, confident smile, hospital setting, medical headshot, soft studio lighting" }
  @{ file="doctor-gupta.webp"; prompt="professional portrait of Indian male transplant surgeon in white coat and scrubs, experienced senior doctor, hospital background, medical headshot" }
  @{ file="doctor-saha.webp"; prompt="professional portrait of Indian male neurosurgeon in white coat, confident focused expression, modern hospital background, medical professional headshot" }
  @{ file="doctor-vaishya.webp"; prompt="professional portrait of Indian male senior neurosurgeon in white coat, glasses, hospital setting, intelligent composed expression, medical headshot" }
  @{ file="doctor-taluja.webp"; prompt="professional portrait of Indian female fertility specialist doctor in white coat, warm confident smile, modern clinic background, medical headshot, soft lighting" }
  @{ file="doctor-chhabra.webp"; prompt="professional portrait of elderly distinguished Indian male spine surgeon in white coat, Padma Shri awardee, wise experienced look, hospital setting medical headshot" }
  @{ file="doctor-sethi.webp"; prompt="professional portrait of Indian male paediatric cardiac surgeon in white coat and scrubs, kind confident expression, hospital background, medical headshot" }
  @{ file="doctor-tempe.webp"; prompt="professional portrait of Indian male senior cardiologist in white coat, confident experienced look, hospital setting, medical professional headshot" }
  @{ file="doctor-garg.webp"; prompt="professional portrait of Indian male orthopedic surgeon in white coat, confident smile, hospital background, medical professional headshot" }
  @{ file="doctor-verma.webp"; prompt="professional portrait of Indian female ophthalmologist in white coat, confident professional look, hospital clinic background, medical headshot" }
  @{ file="doctor-bansal.webp"; prompt="professional portrait of young Indian male gastroenterologist in white coat, confident friendly expression, hospital setting, medical professional headshot" }

  # ─── Delhi Tourism Landmarks (10) ────────────────────
  @{ file="tourism-india-gate.webp"; prompt="India Gate New Delhi at sunset, war memorial arch monument, green lawns, Indian flag, orange and purple sky, famous landmark, tourist photography, beautiful lighting" }
  @{ file="tourism-red-fort.webp"; prompt="Red Fort Lal Qila Delhi, historic Mughal fort red sandstone walls, clear blue sky, UNESCO World Heritage site, grand architectural photography" }
  @{ file="tourism-qutub-minar.webp"; prompt="Qutub Minar Delhi, world tallest brick minaret, ancient Islamic architecture, blue sky with clouds, UNESCO World Heritage, historic monument photography" }
  @{ file="tourism-lotus-temple.webp"; prompt="Lotus Temple Bahai House of Worship New Delhi, white marble flower-shaped architectural marvel, blue sky reflecting pool, clear sunny day photography" }
  @{ file="tourism-akshardham.webp"; prompt="Akshardham Temple Delhi, magnificent Hindu temple complex, pink sandstone and marble carvings, blue sky, grand architecture, spiritual landmark photography" }
  @{ file="tourism-humayuns-tomb.webp"; prompt="Humayun's Tomb Delhi, Mughal garden tomb UNESCO World Heritage site, red sandstone and white marble architecture, symmetrical gardens, historic monument" }
  @{ file="tourism-jama-masjid.webp"; prompt="Jama Masjid Delhi, India largest mosque, red sandstone architecture, minarets and domes, Old Delhi, blue sky, Islamic architectural photography" }
  @{ file="tourism-lodhi-gardens.webp"; prompt="Lodhi Gardens Delhi, historical park with tombs and lush greenery, walking paths, heritage monuments in natural setting, peaceful urban park photography" }
  @{ file="tourism-connaught-place.webp"; prompt="Connaught Place CP New Delhi, iconic circular market with white colonnades, busy urban area, British colonial architecture, city life photography" }
  @{ file="tourism-rashtrapati-bhavan.webp"; prompt="Rashtrapati Bhavan Presidential Palace New Delhi, grand colonial architecture, large dome, manicured Mughal gardens, Raisina Hill, landmark building" }
)

$total = [Math]::Min($images.Count, $StartIndex + $MaxImages)

for ($i = $StartIndex; $i -lt $total; $i++) {
  $img = $images[$i]
  $filepath = Join-Path $OutputDir $img.file
  $prompt = $img.prompt

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

    Write-Host "  -> Saved $($img.file) ($($bytes.Length/1024 -as [int]) KB)"
  }
  catch {
    Write-Host "  -> FAILED: $_" -ForegroundColor Red
    $errorMsg = $_.Exception.Message
    if ($errorMsg -match '\{.*\}') {
      Write-Host "  -> Response: $($Matches[0])" -ForegroundColor Yellow
    }
  }

  Start-Sleep -Milliseconds 200
}

Write-Host "`nDone! Generated $($total - $StartIndex) images in $OutputDir" -ForegroundColor Green
