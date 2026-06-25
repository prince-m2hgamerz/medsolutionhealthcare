You are redesigning asianshealthcare.com — a medical tourism site that
connects international patients with Indian hospitals. The goal is to
transform it from a generic blue healthcare directory into a premium
concierge service that radiates calm authority and warm precision.

This is a full visual redesign. Do NOT change site structure, navigation
labels, URLs, or content. Only change colours, typography, spacing,
component styling, shadows, borders, and visual layout.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN DIRECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aesthetic: "Premium medical concierge." Think private banking meets
healthcare. Spacious, unhurried, deeply legible. Not a hospital directory.

Every visual decision should reinforce: "We are professionals you can
trust with something as important as your health."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. COLOUR SYSTEM — replace entirely
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Remove all instances of the current generic royal blue (#2563EB range).
Replace with this exact palette:

  --color-primary:        #0B3954   /* Deep teal-navy — authority */
  --color-primary-mid:    #1A6B8A   /* Mid teal — links, icons, borders */
  --color-primary-tint:   #E8F4F9   /* Teal tint — hover backgrounds */
  --color-accent:         #C9963A   /* Gold — primary CTAs only */
  --color-accent-light:   #FEF3CD   /* Gold tint — savings pills */
  --color-accent-text:    #92680A   /* Gold dark — text on gold tint */
  --color-surface:        #F7F5F0   /* Warm cream — section backgrounds */
  --color-bg:             #FFFFFF   /* Card and page backgrounds */
  --color-text:           #1C1C1E   /* Charcoal — all body text */
  --color-text-muted:     #6B7280   /* Muted — labels, secondary text */
  --color-text-light:     #9CA3AF   /* Light — placeholders, captions */
  --color-border:         #E5E7EB   /* Default card and input borders */
  --color-border-focus:   #1A6B8A   /* Teal border on focus */

COLOUR USAGE RULES:
- --color-accent (gold) is used ONLY for: primary CTA buttons, savings %, key stat highlights
- --color-primary (deep teal) is used for: headings, nav logo, large stats numbers, timeline elements
- --color-primary-mid is used for: icon colours, link colours, active states, card hover borders
- --color-surface (warm cream) is used for: alternating section backgrounds, stats strip, FAQ bg
- Pure white (#FFF) is used for: cards, nav, form fields
- NEVER use blue, purple, or any colour outside this palette

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. TYPOGRAPHY SYSTEM — replace entirely
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Load from Google Fonts:
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@400;500;600&display=swap');

Font roles:
  Display (H1):    Playfair Display, 52px, weight 600, letter-spacing -0.02em, line-height 1.15
  H2 (sections):   Playfair Display, 34px, weight 500, letter-spacing -0.01em, line-height 1.3
  H3 (cards):      Inter, 17px, weight 600, letter-spacing 0, line-height 1.4
  Body:            Inter, 16px, weight 400, letter-spacing 0, line-height 1.65
  Label/UI text:   Inter, 14px, weight 500
  Eyebrow labels:  Inter, 11px, weight 600, letter-spacing 0.10em, text-transform uppercase, color --color-primary-mid
  Small/captions:  Inter, 13px, weight 400, color --color-text-muted

TYPOGRAPHY RULES:
- Every section heading (H2) must be preceded by an eyebrow label
  Example: eyebrow "WHY CHOOSE US" above heading "Your Trusted Medical Partner"
- Add eyebrows to: About section, Specialties, Doctors, Journey, Testimonials, Hospitals, FAQ
- Body text must be min 16px — increase any 14px body text to 16px
- Never use font-weight 700 or above (current bold headings feel heavy)
- H1 on hero is white (on teal background), all other H2s are --color-primary (#0B3954)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. SPACING & LAYOUT — increase significantly
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Max content width:      1200px (centred, horizontal padding 24px)
  Section padding:        96px top + 96px bottom on desktop
                          56px top + 56px bottom on mobile
  Card internal padding:  28px
  Card gap in grid:       20px
  Nav height:             72px
  Button height:          48px min (increase from current ~38px)
  Input height:           48px
  Between eyebrow + H2:   12px
  Between H2 + subtext:   16px
  Between subtext + content: 48px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. COMPONENT STYLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUTTONS:
  Primary (gold CTA):
    background: #C9963A
    color: #FFFFFF
    border-radius: 8px
    height: 48px
    padding: 0 28px
    font: Inter 15px weight 600
    hover: background #B8872E, box-shadow 0 4px 12px rgba(201,150,58,0.35)
    active: scale(0.98)

  Secondary (outlined):
    background: transparent
    border: 1.5px solid #0B3954
    color: #0B3954
    border-radius: 8px
    height: 48px
    hover: background #E8F4F9

  Ghost (text link):
    no border, no background
    color: #1A6B8A
    hover: underline

CARDS (default):
  background: #FFFFFF
  border: 1px solid #E5E7EB
  border-radius: 12px
  padding: 28px
  transition: border-color 0.2s, box-shadow 0.2s
  hover:
    border-color: #1A6B8A
    box-shadow: 0 4px 20px rgba(11,57,84,0.08)

FORM INPUTS:
  height: 48px
  border: 1px solid #D1D5DB
  border-radius: 8px
  padding: 0 16px
  font: Inter 15px
  focus: border-color #1A6B8A, box-shadow 0 0 0 3px rgba(26,107,138,0.12)

SPECIALTY TAGS / PILLS:
  background: #E8F4F9
  color: #0B3954
  border-radius: 100px
  padding: 4px 12px
  font: Inter 12px weight 500

SAVINGS BADGE:
  background: #FEF3CD
  color: #92680A
  border-radius: 100px
  padding: 4px 12px
  font: Inter 12px weight 600

EYEBROW LABEL:
  color: #1A6B8A
  font: Inter 11px weight 600 uppercase letter-spacing 0.10em
  display: block
  margin-bottom: 12px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. SECTION-BY-SECTION REDESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NAVIGATION:
- Background: white, height 72px
- Logo: use --color-primary (#0B3954) for text/icon colour
- Nav links: Inter 15px weight 500, color #1C1C1E
- "Explore ⌘K" search trigger: style as a pill with 1px border #E5E7EB,
  background #F9FAFB, Inter 13px, subtle magnifier icon left
- "Get Free Quote" button: use gold Primary button style (defined above)
- On scroll >80px: add backdrop-filter blur(12px), background rgba(255,255,255,0.92),
  bottom border 1px solid #E5E7EB

HERO SECTION:
- Change to a split layout: left 55% / right 45%
- Left panel: background #0B3954 (solid teal-navy), padding 80px 60px
  - Small eyebrow: "TRUSTED MEDICAL TOURISM IN INDIA" in Inter 11px
    weight 600, letter-spacing 0.10em, color rgba(255,255,255,0.6)
  - H1: "World-Class Treatment at Affordable Cost" in Playfair Display
    52px weight 600, color white, line-height 1.15
  - Subheading: Inter 18px, color rgba(255,255,255,0.85), margin-top 20px
  - Trust badges (No Service Fee · JCI & NABH · 24/7 Support · Save 60-80%)
    as white pills with teal border, margin-top 32px
  - Gold primary CTA button: "Get Free Medical Opinion →", margin-top 40px
  - Secondary ghost button in white: "View Treatment Costs"
- Right panel: the existing hero image fills height 100%, object-fit cover,
  NO text overlay, NO gradient
- Below the hero: a full-width white search panel, 80px height, with the
  4 Find tabs (Cost/Doctor/Hospital/Hotel) styled as a clean tab switcher
  with teal bottom border on active tab, and a search input + blue Search button

STATS SECTION:
- Background: #F7F5F0 (warm cream)
- Layout: 3-column grid on desktop, displaying 6 stats in 2 rows
- Each stat: number in Playfair Display 48px weight 600, color #0B3954;
  label in Inter 14px, color #6B7280
- Add a 3px left border in #C9963A (gold) to each stat block
- Remove any count-up animation that defaults to "0+" — hardcode the values

ABOUT / WHO WE ARE SECTION:
- Background: white
- Layout: 50/50 split: content left, image right
- Add eyebrow: "ABOUT US"
- H2: Playfair Display
- Replace the competitor-hosted image (safartibbi.com) with an illustrative
  placeholder or a self-hosted image. Use a teal-tinted placeholder card
  if no image is available.
- 4 feature bullets: each with a small teal checkmark circle icon (24px)
  and Inter 15px text. Not a bullet list — use a 2x2 grid of checkmark items.

SPECIALTIES SECTION:
- Background: white
- Add eyebrow: "WHAT WE TREAT"
- Grid: 5 columns desktop, 3 tablet, 2 mobile
- Each card: white bg, 1px border, 12px radius, 28px padding
  - Icon: Tabler outline icon, 40px, color #1A6B8A, centred
  - Label: Inter 14px weight 500, color #1C1C1E, centred, margin-top 12px
  - On hover: border → teal, background → #E8F4F9

COST COMPARISON TABLE:
- Background: #F7F5F0
- Add eyebrow: "TRANSPARENT PRICING"
- Table max-width: 820px, centred
- Header row: background #0B3954, text white, Inter 14px weight 500
- Data rows:
  - Alternating white / #F7F5F0
  - Row height: 56px
  - Treatment name: Inter 15px weight 500
  - India cost: Inter 15px weight 600, color #1A6B8A
  - Abroad cost: Inter 14px, color #9CA3AF
  - Savings: gold savings badge pill (see SAVINGS BADGE above)
- Remove the duplicate "Treatment Packages" card section below —
  the table already covers this content

DOCTORS SECTION (homepage):
- Add eyebrow: "OUR SPECIALISTS"
- LIMIT to 8 cards maximum on homepage
- Card layout: portrait style, 240px wide
  - Top 45%: teal-tinted placeholder (#E8F4F9) or photo (object-fit: cover)
  - Doctor name: Inter 17px weight 600
  - Specialty: teal pill badge
  - Hospital: Inter 13px muted with a small building icon
  - "Get Consultation →" text link in gold at bottom
- Remove all star ratings (4.5 uniform is not credible)
- Add "Browse all 1,754 doctors →" link below the grid
- Grid: 4 columns desktop, 2 mobile

PATIENT JOURNEY SECTION:
- Background: #F7F5F0
- Add eyebrow: "HOW IT WORKS"
- REMOVE the stolen competitor image (satyughealthcare.com URL)
- REPLACE with a custom vertical timeline:
  Left side: a continuous vertical line in #1A6B8A (2px)
  Each of the 7 steps:
    - Circle: 44px diameter, border 2px solid #1A6B8A, background white,
      step number inside in Playfair Display 18px weight 600, color #0B3954
    - Circle sits centred on the vertical line
    - To the right: step title in Inter 16px weight 600, color #0B3954
    - Below title: 1-2 sentence description in Inter 14px, color #6B7280
    - Vertical spacing between steps: 48px

  Steps:
    1. Share Medical Reports
    2. Get Free Specialist Opinion
    3. Doctor & Hospital Selection
    4. Apply for Medical Visa
    5. Travel to India
    6. Treatment & Recovery
    7. Return Home + Follow-Up

TESTIMONIALS SECTION:
- Background: white
- Add eyebrow: "PATIENT STORIES"
- Show 3 testimonial cards in a row (currently only 1 exists — use the
  one real quote for the first card, create placeholder structure for
  the remaining 2 with "Testimonial from [Country]" labels)
- Each card: white bg, 12px radius, 1px border, 28px padding
  - Large quotation mark " in Playfair Display 64px, color #E8F4F9 (teal
    tint), positioned absolute top-left as decorative element
  - Quote text: Inter 15px, line-height 1.7
  - Bottom: initials avatar (40px circle, #0B3954 bg, white initials),
    name in Inter 14px weight 500, country + flag emoji in Inter 13px muted,
    treatment type pill

HOSPITALS SECTION:
- Background: #F7F5F0
- Add eyebrow: "PARTNER HOSPITALS"
- Hospital cards: white bg, 12px radius, 28px padding
  - Accreditation badges (JCI, NABH) as small teal pills top-right
  - Hospital name: Inter 16px weight 600
  - City + bed count: Inter 13px muted
  - Hover: teal border

FOOTER:
- Background: #0B3954 (deep teal-navy)
- All text: rgba(255,255,255,0.75)
- Section headings: white, Inter 14px weight 600
- Links: rgba(255,255,255,0.65), hover white
- Logo: white version
- Copyright bar: slightly darker teal, white text 13px
- Reduce to 3 columns (see UX audit prompt for column structure)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. MOBILE-SPECIFIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Hero: stack vertically — teal panel on top (with headline + CTA),
  image below (200px height)
- Stats: 2 columns, 3 rows
- Specialties: 2 columns
- Doctors grid: 1 column scroll or 2-column compact
- Journey timeline: single column, all steps left-aligned
- Testimonials: horizontal scroll (one card visible at a time)
- Bottom sticky bar: 2 buttons only
    Left half: "📞 Call Now" — outlined teal
    Right half: "💬 WhatsApp" — gold filled
    Height: 64px, background white, top border 1px #E5E7EB
  Remove all floating chat bubbles/widgets from mobile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. SCROLLING TICKER — RESKIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The two scrolling marquee tickers (countries + specialties) currently use
a generic style. Reskin them:
- Container: background #0B3954 (teal-navy), height 40px
- Text: Inter 13px weight 500, color rgba(255,255,255,0.85)
- Separator between items: a small diamond ◆ in #C9963A (gold)
- Reduce marquee speed slightly (animation-duration: 35s vs current ~20s)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. DO NOT CHANGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Site URL structure and navigation links
- All content text (headings, descriptions, prices)
- Page sections order (except removing duplicate pricing section)
- The ⌘K search functionality
- FAQ accordion behaviour (just restyle it)
- Insurance partner logos (just restyle their container)
- The "Available 24/7" label and contact number
- Form field labels and dropdown options

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CODECATALOG — Full Project Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stack: Next.js 14+ (App Router) + Supabase + Tailwind CSS + Resend (email) + Rollbar (error tracking) + Framer Motion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPABASE SCHEMA (15 tables)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content:
  doctors           id, name, slug, photo_url, experience_years, hospital_id, specialties[], qualifications, about, is_featured
  hospitals         id, name, slug, logo_url, city, state, beds_count, accreditations[], about, is_featured
  treatments        id, name, slug, category, cost_usd_min, cost_usd_max, description, is_featured
  specialties       id, name, slug, icon_url, description
  blogs             id, title, slug, content, category, thumbnail_url, author, published_at, is_published
  testimonials      id, patient_name, country, treatment, video_url, text_content, rating, is_approved
  hotels            id, name, address, hospital_id, stars, price_range, booking_url, photo_url
  insurance_companies  id, name, slug, logo_url, description

Junction:
  doctor_hospital     doctor_id, hospital_id
  doctor_specialties  doctor_id, specialty_id

CRM:
  leads       id, form_type, name, age, gender, country, phone, email, medical_condition, doctor_preference, insurance_company, message, file_url, status (new|contacted|converted|closed), notes, assigned_to
  admin_users id, email, role (super_admin|editor|viewer)

Config:
  site_settings  id, key, value, updated_at

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROUTE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Route Group       Pages
───────────────   ──────────────────────────────────────────
(public)/         home, about-us, blogs, contact-us, doctors, find-cost, hospitals, hotels, insurance-company, search, speciality, specialties, testimonials, tourism, treatment-package, treatments
admin/            blogs, doctors, email-marketing, hospitals, hotels, inquiries, insurance, leads, login, settings, specialties, subscribers, testimonials, treatments, users
api/              admin, contact, email-marketing, image-proxy, inquiries, inquiry, leads, newsletter, rss, sitemap, test-email
Standalone        cost-calculator, disclaimer, guides, premium, privacy-policy, refund-policy, terms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT ARCHITECTURE (77 files total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

home/ (22 — all read)
  HeroSection, EmergencyBanner, CountriesTicker, StatsCounter, WhoWeAre
  TopSpecialties, WhyChooseUs, PatientSupportServices, FeaturedDoctors
  FeaturedHospitals, TreatmentCostShowcase, CostComparison
  MedicalCareGallery, GetConsultation, QuickInquiryForm
  PatientTestimonials, InsuranceLogos, TravelProcess
  NewsletterSignup, FAQSection, BlogPreviewSection, BottomStickyBar

layout/ (3 — all read)
  AppShell, Navbar, Footer

shared/ (13 — unread)
  BreadcrumbNav, CookieConsent, DoctorCard, DoctorsGrid, EmptyState
  HorizontalSlider (carousel), HospitalCard, InquiryForm, JsonLd
  LoadingSkeleton, RollbarProvider, TestimonialCard, TreatmentCard

forms/ (4 — unread)
  CallbackForm, ContactForm, DoctorOpinionForm, InsuranceCheckForm

search/ (4 — unread)
  SearchModal, DoctorSearch, HospitalSearch, TreatmentSearch

admin/ (6 — unread)
  DataTable, ImageUploadField, LeadsTable, Modal, RichTextEditor, StatsCard

ui/ (0) — empty
premium/ (0) — empty

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATA FLOW (home page)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(public)/page.tsx is a Server Component:
  1. Creates Supabase server client
  2. Fetches in parallel: featured treatments (6), approved testimonials (10), insurance names, site_settings images
  3. Transforms responses into plain objects (no Date/Row types)
  4. Falls back to fallback-data.ts on error
  5. Passes data as props to 22 client components
  6. Images flow via Record<SiteImageKey, string> merged from site_settings

Key files:
  lib/constants.ts             SITE, SOCIAL, CONTACT, ROUTES, 24 SPECIALTIES, 47 COUNTRIES, META
  lib/site-images.ts           mergeSiteImages(), SiteImageKey type, SITE_IMAGE_KEYS, SITE_IMAGE_DEFAULTS
  lib/fallback-data.ts         fallbackDoctors, fallbackHospitals, fallbackInsurances, fallbackTestimonials
  lib/json-ld.ts               organizationSchema, websiteSchema, faqPageSchema
  lib/server-queries.ts        Server-side Supabase query helpers
  lib/utils.ts                 Shared utility functions
  lib/supabase/client.ts       Browser client
  lib/supabase/server.ts       Server client
  lib/supabase/middleware.ts   Supabase middleware
  lib/email/resend.ts          Resend email client
  hooks/useSiteSettings.ts     Hook for site settings
  types/database.ts            Full Database, Doctor, Hospital, Treatment, etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM (tailwind.config.ts + globals.css)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Color tokens defined in tailwind.config.ts under theme.extend.colors:
  aloe (primary teal), gold (accent), cream (surface), charcoal (text)

Custom classes in globals.css:
  .container-cinematic   max-w-[1200px] mx-auto px-6
  .text-display-md       Playfair Display 34px weight 500
  .pill-tag              specialty pill
  .btn-aloe              primary CTA
  .btn-outline           outlined CTA

Typography: Inter (body/UI), Playfair Display (headings)
Animation: Framer Motion — all home sections are "use client" with scroll-triggered fades/slides