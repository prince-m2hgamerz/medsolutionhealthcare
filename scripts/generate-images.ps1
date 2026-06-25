param(
  [string]$ApiKey = "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",
  [int]$StartIndex = 0,
  [int]$MaxImages = 999
)

$ApiUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"
$OutputDir = "public\images"

$images = @(
  @{ file="home-hero.webp"; prompt="ultra-modern hospital building exterior in India, glass curtain wall, palm trees, professional architectural photography, golden hour, warm sunlight, photorealistic, 8K" }
  @{ file="home-support.webp"; prompt="compassionate Indian doctor holding patient hand in hospital bed, warm care, emotional support, medical tourism, documentary style photography" }
  @{ file="home-cost.webp"; prompt="transparent USD and INR coins on medical report, cost comparison concept, healthcare savings, financial planning for surgery, clean professional still life" }
  @{ file="home-opinion.webp"; prompt="patient video calling doctor on laptop from home, telemedicine consultation, digital healthcare, modern medical opinion, home office setting" }
  @{ file="home-hospital-match.webp"; prompt="patient comparing two modern hospital buildings on tablet screen, hospital selection, medical tourism decision, clean UI concept" }
  @{ file="home-visa-travel.webp"; prompt="passport medical visa stamps flight tickets and hospital documents arranged on marble table, medical travel planning, professional flat lay" }
  @{ file="home-airport-pickup.webp"; prompt="smiling Indian driver holding name sign at airport arrival gate welcoming medical tourist, professional hospitality, bright airport terminal" }
  @{ file="home-interpreter.webp"; prompt="professional medical interpreter assisting doctor and international patient consultation, language bridge, hospital room, cultural support" }
  @{ file="home-followup.webp"; prompt="patient recovering at home video consulting with Indian doctor on tablet, post-treatment follow-up care, telemedicine, comfortable home setting" }
  @{ file="treatment-cardiac.webp"; prompt="open heart surgery team in modern Indian operating theater, blue sterile lighting, cardiac surgeons performing bypass, medical documentary style" }
  @{ file="treatment-ortho.webp"; prompt="orthopedic surgeon examining knee X-ray with patient in modern Indian hospital clinic, medical consultation, professional healthcare photography" }
  @{ file="treatment-oncology.webp"; prompt="radiation therapy machine in modern Indian cancer treatment center, advanced medical technology, blue ambient light, oncology department" }
  @{ file="treatment-transplant.webp"; prompt="organ transplant surgery team in sterile modern Indian hospital operating room, green scrubs, advanced medical equipment, surgical documentary" }
  @{ file="treatment-knee.webp"; prompt="successful knee replacement surgery scar close-up with surgeon marking, modern orthopaedic procedure, minimal invasive technique result" }
  @{ file="treatment-hip.webp"; prompt="hip replacement implant model held by orthopedic surgeon explaining to patient, modern joint replacement consultation, Indian hospital" }
  @{ file="treatment-spine.webp"; prompt="spine surgeon analyzing MRI scan results with patient in modern neurosurgery clinic, Indian hospital, advanced spinal care, professional medical" }
  @{ file="treatment-heart-bypass.webp"; prompt="cardiac surgeon team performing coronary artery bypass graft surgery, open heart procedure, sterile operating theater, dramatic blue lighting" }
  @{ file="treatment-angioplasty.webp"; prompt="angiogram screen showing coronary arteries during angioplasty procedure, catheter lab, interventional cardiology, modern medical technology" }
  @{ file="treatment-bmt.webp"; prompt="bone marrow transplant unit modern Indian hospital, sterile patient room with advanced monitoring equipment, hematology oncology, gentle lighting" }
  @{ file="treatment-liver.webp"; prompt="liver transplant surgery team in operating room, organ transplantation procedure, green sterile drapes, advanced surgical lighting" }
  @{ file="treatment-kidney.webp"; prompt="kidney transplant surgery in progress, organ transplantation, skilled surgical team, modern Indian hospital, documentary medical photography" }
  @{ file="treatment-ivf.webp"; prompt="embryologist examining petri dish under microscope in modern IVF laboratory, fertility treatment, reproductive technology, scientific precision" }
  @{ file="treatment-dental.webp"; prompt="modern dental implant procedure, dentist placing implant in clean clinical setting, advanced dentistry, bright white lighting" }
  @{ file="treatment-bariatric.webp"; prompt="bariatric surgery team performing laparoscopic gastric bypass, keyhole surgery, modern operating room, medical documentary style" }
  @{ file="treatment-hair.webp"; prompt="hair transplant procedure showing FUE graft extraction on patient scalp, modern clinic, precise medical photography, clean sterile setting" }
  @{ file="treatment-prostate.webp"; prompt="Da Vinci robotic surgery console used for prostate surgery, surgeons operating robotic arms, advanced minimally invasive technology" }
  @{ file="treatment-cataract.webp"; prompt="cataract eye surgery under microscope, ophthalmologist performing phacoemulsification procedure, modern opthalmology operating room" }
  @{ file="specialty-cardiology.webp"; prompt="cardiologist examining ECG report with heart model on desk, cardiac care consultation, modern Indian hospital clinic" }
  @{ file="specialty-orthopedics.webp"; prompt="orthopedic surgeon in clinic with skeleton model explaining joint replacement to patient, medical consultation, professional setting" }
  @{ file="specialty-neurology.webp"; prompt="neurosurgeon examining brain MRI scans on light box with patient, neurology consultation, advanced diagnostic imaging, Indian hospital" }
  @{ file="specialty-oncology.webp"; prompt="oncologist reviewing chemotherapy treatment plan with patient in modern cancer center, compassionate cancer care, bright consultation room" }
  @{ file="specialty-gastroenterology.webp"; prompt="gastroenterologist performing endoscopy procedure in modern clinic, digestive health examination, advanced medical equipment" }
  @{ file="specialty-nephrology.webp"; prompt="kidney specialist reviewing dialysis patient chart in modern nephrology unit, renal care, doctor patient consultation" }
  @{ file="specialty-urology.webp"; prompt="urologist examining ultrasound results with patient in clinic, men health consultation, modern medical setting Indian hospital" }
  @{ file="specialty-fertility.webp"; prompt="fertility specialist consulting happy couple in modern clinic, reproductive medicine, family planning consultation, warm professional atmosphere" }
  @{ file="specialty-transplant.webp"; prompt="transplant coordinator meeting with recipient family explaining procedure, organ transplant counseling, supportive healthcare team" }
  @{ file="specialty-dental.webp"; prompt="dentist performing checkup in modern dental office, advanced dental chair with equipment, bright clean clinic, professional care" }
  @{ file="specialty-ophthalmology.webp"; prompt="ophthalmologist examining patient with slit lamp microscope, eye examination, modern vision care clinic, India" }
  @{ file="specialty-cosmetic.webp"; prompt="cosmetic surgeon consulting patient in modern clinic, facial aesthetics consultation, medical spa setting, professional elegant atmosphere" }
  @{ file="about-hero.webp"; prompt="international patients from Africa Middle East and Asia together with Indian doctors in modern hospital lobby, diverse group smiling, medical tourism" }
  @{ file="about-opinion.webp"; prompt="medical team reviewing patient reports and digital tablet together, collaborative diagnosis, Indian hospital consultation room" }
  @{ file="about-hospital-network.webp"; prompt="aerial view of large modern Indian hospital campus with multiple buildings, medical city, comprehensive healthcare network" }
  @{ file="about-travel-support.webp"; prompt="travel desk in hospital lobby, patient coordinator assisting international visitor with paperwork, warm hospitality" }
  @{ file="tourism-hero.webp"; prompt="Taj Mahal at sunrise with modern hospital in background, India medical tourism concept, beautiful architectural contrast" }
  @{ file="tourism-delhi.webp"; prompt="India Gate New Delhi with colorful flower gardens, clear blue sky, patriotic monument, tourist photography" }
  @{ file="tourism-agra.webp"; prompt="Taj Mahal full view at golden hour, reflecting pool, majestic marble mausoleum, Agra India, world wonder" }
  @{ file="tourism-jaipur.webp"; prompt="Hawa Mahal palace facade Jaipur, pink sandstone architecture, blue sky, Rajasthan heritage, vibrant Indian culture" }
  @{ file="tourism-kerala.webp"; prompt="houseboat cruising through Kerala backwaters, green palm trees, serene water, tropical paradise, South India tourism" }
  @{ file="tourism-mumbai.webp"; prompt="Marine Drive skyline Mumbai at sunset, Queen's Necklace, Arabian Sea, modern cityscape with palm trees" }
  @{ file="tourism-goa.webp"; prompt="Calangute beach Goa with palm trees and clear blue water, tourist destination, golden sand, relaxing tropical beach" }
  @{ file="doctors-hero.webp"; prompt="group of diverse Indian doctors in white coats walking together in modern hospital corridor, medical professionals team, healthcare leadership" }
  @{ file="hospitals-hero.webp"; prompt="ultra-modern Indian hospital building with helipad on roof, glass architecture, blue sky, medical tourism facility" }
  @{ file="treatments-hero.webp"; prompt="advanced operating theater with robotic surgery equipment, cutting edge medical technology, blue ambient lighting" }
  @{ file="specialities-hero.webp"; prompt="modern hospital corridor with various specialty department signs, clean and bright, state of the art medical facility" }
  @{ file="contact-hero.webp"; prompt="professional hospital reception desk with modern design, patient coordinator smiling, welcoming atmosphere" }
  @{ file="hotels-hero.webp"; prompt="luxury hotel room with hospital view, comfortable accommodation for medical tourists, premium interior design" }
  @{ file="insurance-hero.webp"; prompt="health insurance documents and cards arranged professionally on desk, medical coverage concept, clean corporate photography" }
  @{ file="blogs-hero.webp"; prompt="medical blog content creation with laptop and healthcare notes, health education and research, modern digital publishing" }
  @{ file="testimonials-hero.webp"; prompt="happy recovered patient embracing doctor in modern hospital room, successful medical treatment, emotional gratitude, heartwarming" }
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

Write-Host "`nDone! Generated images in $OutputDir" -ForegroundColor Green
