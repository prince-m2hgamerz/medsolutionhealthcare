param(
  [string]$ApiKey = "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"
)

$ApiUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"
$OutputDir = "public\images"

$images = @(
  # ─── Remaining Doctor Portraits (18) ────────────────
  @{ file="doctor-dua.webp"; prompt="professional portrait of Indian male hematologist doctor in white coat, confident kind expression, hospital background, medical professional headshot, soft studio lighting" }
  @{ file="doctor-gulati.webp"; prompt="professional portrait of Indian male senior orthopedic surgeon in white coat, confident experienced smile, hospital setting, medical headshot" }
  @{ file="doctor-arora.webp"; prompt="professional portrait of Indian male senior gastroenterologist doctor in white coat, glasses, experienced look, hospital background, medical headshot" }
  @{ file="doctor-vij.webp"; prompt="professional portrait of Indian male transplant surgeon in white coat and scrubs, confident look, modern hospital setting, medical headshot" }
  @{ file="doctor-miglani.webp"; prompt="professional portrait of Indian male orthopedic surgeon in white coat, friendly confident expression, hospital clinic background, medical headshot" }
  @{ file="doctor-rana.webp"; prompt="professional portrait of elderly Indian male nephrologist in white coat, wise experienced expression, hospital background, medical headshot" }
  @{ file="doctor-meharwal.webp"; prompt="professional portrait of Indian male senior cardiac surgeon in white coat, distinguished look, hospital setting, medical professional headshot" }
  @{ file="doctor-aggarwal.webp"; prompt="professional portrait of Indian male neurologist in white coat, glasses, confident intelligent expression, hospital consultation room background" }
  @{ file="doctor-kaushal.webp"; prompt="professional portrait of Indian male cardiologist in white coat, confident smile, modern hospital background, medical professional headshot" }
  @{ file="doctor-gupta2.webp"; prompt="professional portrait of Indian male senior cardiologist in white coat, wise confident look, hospital setting, medical headshot" }
  @{ file="doctor-gill.webp"; prompt="professional portrait of Indian male neurologist in white coat, friendly professional smile, modern hospital background, medical headshot" }
  @{ file="doctor-srivastava.webp"; prompt="professional portrait of Indian male urologist in white coat, confident expression, hospital setting, medical professional headshot" }
  @{ file="doctor-sharma2.webp"; prompt="professional portrait of young Indian female fertility specialist in white coat, warm smile, modern clinic background, medical headshot" }
  @{ file="doctor-saxena.webp"; prompt="professional portrait of Indian male oncologist in white coat, compassionate confident look, hospital background, medical headshot" }
  @{ file="doctor-loomba.webp"; prompt="professional portrait of Indian male orthopedic surgeon in white coat, friendly confident smile, hospital clinic setting, medical headshot" }
  @{ file="doctor-rajendra-kumar.webp"; prompt="professional portrait of Indian male senior cardiologist in white coat, distinguished look, hospital background, medical professional headshot" }
  @{ file="doctor-alok-gupta.webp"; prompt="professional portrait of Indian male orthopedic surgeon in white coat, confident expression, modern hospital setting, medical headshot" }
  @{ file="doctor-amit-kumar.webp"; prompt="professional portrait of Indian male orthopedic surgeon in white coat, friendly professional smile, hospital background, medical headshot" }

  # ─── Retry failed tourism images (5) ────────────────
  @{ file="tourism-india-gate.webp"; prompt="India Gate New Delhi at sunset, war memorial arch monument, green lawns, Indian flag, orange and purple sky, famous landmark, tourist photography, beautiful lighting" }
  @{ file="tourism-red-fort.webp"; prompt="Red Fort Lal Qila Delhi, historic Mughal fort red sandstone walls, clear blue sky, UNESCO World Heritage site, grand architectural photography" }
  @{ file="tourism-qutub-minar.webp"; prompt="Qutub Minar Delhi, world tallest brick minaret, ancient Islamic architecture, blue sky with clouds, UNESCO World Heritage, historic monument photography" }
  @{ file="tourism-akshardham.webp"; prompt="Akshardham Temple Delhi, magnificent Hindu temple complex, pink sandstone and marble carvings, blue sky, grand architecture, spiritual landmark photography" }
  @{ file="tourism-rashtrapati-bhavan.webp"; prompt="Rashtrapati Bhavan Presidential Palace New Delhi, grand colonial architecture, large dome, manicured Mughal gardens, Raisina Hill, landmark building" }
)

for ($i = 0; $i -lt $images.Count; $i++) {
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
  }

  Start-Sleep -Milliseconds 200
}

Write-Host "`nDone!" -ForegroundColor Green
