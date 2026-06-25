param(
  [string]$ApiKey = "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"
)

$ApiUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"
$OutputDir = "public\images"

$images = @(
  @{ file="tourism-india-gate.webp"; prompt="beautiful scenic view of famous stone arch monument in New Delhi at sunset, green grass lawns, clear sky, architectural landmark photography, travel destination" }
  @{ file="tourism-red-fort.webp"; prompt="historic red sandstone palace fort in Old Delhi India, Mughal architecture, blue sky, famous UNESCO heritage building exterior, travel photography" }
  @{ file="tourism-qutub-minar.webp"; prompt="tall ancient stone victory tower landmark in New Delhi, intricate carvings, blue sky, historic monument surrounded by green lawns, travel photography" }
  @{ file="tourism-akshardham.webp"; prompt="large ornate pink sandstone temple complex in New Delhi India, intricate carved pillars and domes, blue sky, spiritual architecture photography" }
  @{ file="tourism-rashtrapati-bhavan.webp"; prompt="grand presidential palace building in New Delhi India, large central dome, red sandstone architecture, manicured gardens, official residence photography" }
)

for ($i = 0; $i -lt $images.Count; $i++) {
  $img = $images[$i]
  $filepath = Join-Path $OutputDir $img.file
  $prompt = $img.prompt

  Write-Host "[$($i+1)/$($images.Count)] Generating $($img.file)..."
  Write-Host "  Prompt: $prompt"

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
    if ($_.Exception.Response) {
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      Write-Host "  -> Response: $($reader.ReadToEnd())" -ForegroundColor Yellow
      $reader.Close()
    }
  }

  Start-Sleep -Milliseconds 500
}

Write-Host "`nDone!" -ForegroundColor Green
