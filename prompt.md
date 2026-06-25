Yahan main aapko ek **complete master prompt** aur **file structure** deta hoon jo aap apne agent ko de saken:Ab neeche **complete master prompt** aur **file structure** hai — copy karke agent ko de do:

---

## 📋 Master Prompt (Agent ke liye)

```
You are an expert full-stack developer. Build a complete Medical Tourism website 
similar to Satyug Healthcare (satyughealthcare.com) for an Indian medical tourism 
company. The website connects international patients with Indian hospitals.

TECH STACK:
- Framework: Next.js 14 (App Router)
- Design System: npx getdesign@latest add shopify
- Database + Auth: Supabase (PostgreSQL + Row Level Security)
- Deployment: Vercel only
- Language: TypeScript
- Styling: Tailwind CSS (from getdesign)
- Email: Resend (for lead notifications)

---

## PUBLIC WEBSITE PAGES

1. Home page (/) — Hero, search bar (find doctor/hospital/cost), 
   stats counter, why choose us, featured hospitals, featured doctors, 
   patient testimonials, treatment packages, insurance logos

2. About Us (/about-us)

3. Doctors listing (/doctors) — filter by specialty, hospital, experience
   Doctor detail (/doctors/[slug])

4. Hospitals listing (/hospitals) — filter by city, accreditation (NABH/JCI)
   Hospital detail (/hospitals/[slug])

5. Treatment Packages (/treatment-package) — list with cost in USD
   Package detail (/treatment-package/[slug])

6. Specialties (/speciality) — all medical specialties
   Specialty detail (/speciality/[slug])

7. Contact Us (/contact-us) — contact form + WhatsApp button

8. Testimonials (/testimonials) — video + text testimonials

9. Blogs (/blogs) — list page
   Blog detail (/blogs/[slug])
   Blog categories: Medical Visa Guide, Tourism Blog, Treatment Blog

10. Insurance (/insurance-company) — list of accepted insurances
    Insurance detail (/insurance-company/[slug])

11. Hotels (/hotels) — near hospitals

12. Tourism (/tourism) — India tourism info for patients

13. Find Cost (/treatment-package) — search + filter by procedure

---

## LEAD CAPTURE FORMS (save to Supabase)

Form 1: "Receive Doctor Opinion" popup
  Fields: name, age, gender, country, phone (with country code), 
  email, medical condition, select doctor, upload medical reports

Form 2: "Check Insurance Eligibility" popup
  Fields: name, gender, country, phone, insurance company (dropdown), 
  upload insurance card

Form 3: Contact Us form
  Fields: name, email, phone, country, message, treatment needed

Form 4: "Request a Call Back" floating button
  Fields: name, phone, country, best time to call

ALL forms must:
- Save data to Supabase `leads` table with status tracking
- Send email notification to admin via Resend
- Show success toast on submission
- Be accessible via WhatsApp button (wa.me link)

---

## SUPABASE DATABASE SCHEMA

Tables:
1. doctors (id, name, slug, photo_url, experience_years, hospital_id, 
   specialties[], qualifications, about, is_featured, created_at)

2. hospitals (id, name, slug, logo_url, city, state, beds_count, 
   accreditations[], about, is_featured, created_at)

3. treatments (id, name, slug, category, cost_usd_min, cost_usd_max, 
   description, is_featured, created_at)

4. doctor_hospital (doctor_id, hospital_id) — many-to-many

5. specialties (id, name, slug, icon_url, description)

6. doctor_specialties (doctor_id, specialty_id)

7. blogs (id, title, slug, content, category, thumbnail_url, 
   author, published_at, is_published)

8. insurance_companies (id, name, slug, logo_url, description)

9. hotels (id, name, address, hospital_id, stars, price_range, 
   booking_url, photo_url)

10. testimonials (id, patient_name, country, treatment, video_url, 
    text_content, rating, is_approved)

11. leads (id, form_type, name, age, gender, country, phone, email, 
    medical_condition, doctor_preference, insurance_company, 
    message, file_url, status [new/contacted/converted/closed], 
    notes, assigned_to, created_at, updated_at)

12. admin_users (id, email, role [super_admin/editor/viewer], created_at)

13. site_settings (id, key, value, updated_at) 
    — for editable homepage content, phone numbers, WhatsApp number, 
    contact email, social links

---

## ADMIN PANEL (/admin)

Protected routes — only admin_users can access (Supabase Auth + RLS)

Admin pages:
/admin — Dashboard (stats: total leads, new leads today, 
          conversion rate, top treatments)

/admin/leads — All form submissions table
  - Filter by: form type, status, date range, country
  - Update status, add notes, assign to team member
  - Export to CSV

/admin/doctors — CRUD for doctors
  - Add/edit/delete doctor with photo upload (Supabase Storage)
  - Assign hospitals and specialties

/admin/hospitals — CRUD for hospitals
  - Add/edit/delete with logo upload

/admin/treatments — CRUD for treatment packages with pricing

/admin/blogs — CRUD for blogs with rich text editor (Tiptap)

/admin/testimonials — Approve/reject testimonials

/admin/insurance — CRUD for insurance companies

/admin/hotels — CRUD for hotels

/admin/settings — Edit site settings (phone, WhatsApp, email, 
                   social links, homepage hero text)

/admin/users — Manage admin users (super_admin only)

---

## KEY COMPONENTS TO BUILD

components/
  ui/ (from getdesign shopify)
  layout/
    Navbar.tsx — sticky, mobile hamburger menu
    Footer.tsx
    WhatsAppButton.tsx — floating bottom-right
    CallbackButton.tsx — floating bottom-right  
  forms/
    DoctorOpinionForm.tsx — modal popup
    InsuranceCheckForm.tsx — modal popup
    ContactForm.tsx
    CallbackForm.tsx
  home/
    HeroSection.tsx — with search bar
    StatsCounter.tsx — animated numbers
    WhyChooseUs.tsx
    FeaturedDoctors.tsx
    FeaturedHospitals.tsx
    TreatmentPackages.tsx
    PatientTestimonials.tsx
    InsuranceLogos.tsx
    TravelProcess.tsx — step by step process
  search/
    DoctorSearch.tsx
    HospitalSearch.tsx
    TreatmentSearch.tsx

---

## ENVIRONMENT VARIABLES NEEDED

M2H_PUBLIC_SUPABASE_URL=
M2H_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
M2H_PUBLIC_WHATSAPP_NUMBER=918860606766
M2H_PUBLIC_SITE_URL=

---

## IMPORTANT NOTES

1. All public pages must be SEO optimized with proper meta tags, 
   Open Graph tags, and structured data (JSON-LD) for medical business

2. Images must use next/image with Supabase Storage URLs

3. Add sitemap.xml and robots.txt generation

4. Mobile-first responsive design — target international patients 
   on mobile (Africa, Bangladesh, Middle East users)

5. WhatsApp button visible on every page linking to 
   wa.me/919818322072 with pre-filled message

6. Admin panel must use Supabase Auth — no separate auth system

7. Use server components where possible, client components 
   only for interactive parts

8. Add loading skeletons for all data-fetching pages

9. All costs shown in USD

10. Support country phone codes in all forms (full list)
```

---

## 📁 File Structure

```
medical-tourism-website/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    ← Homepage
│   │   ├── about-us/page.tsx
│   │   ├── doctors/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── hospitals/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── treatment-package/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── speciality/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── insurance-company/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── hotels/page.tsx
│   │   ├── tourism/page.tsx
│   │   ├── testimonials/page.tsx
│   │   └── contact-us/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                  ← Admin layout with auth check
│   │   ├── page.tsx                    ← Dashboard
│   │   ├── leads/page.tsx
│   │   ├── doctors/page.tsx
│   │   ├── hospitals/page.tsx
│   │   ├── treatments/page.tsx
│   │   ├── blogs/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── insurance/page.tsx
│   │   ├── hotels/page.tsx
│   │   ├── settings/page.tsx
│   │   └── users/page.tsx
│   ├── api/
│   │   ├── leads/route.ts              ← Save lead + send email
│   │   └── sitemap/route.ts
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                             ← getdesign shopify components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── WhatsAppButton.tsx
│   │   └── CallbackButton.tsx
│   ├── forms/
│   │   ├── DoctorOpinionForm.tsx
│   │   ├── InsuranceCheckForm.tsx
│   │   ├── ContactForm.tsx
│   │   └── CallbackForm.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsCounter.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── FeaturedDoctors.tsx
│   │   ├── FeaturedHospitals.tsx
│   │   ├── TreatmentPackages.tsx
│   │   ├── PatientTestimonials.tsx
│   │   ├── InsuranceLogos.tsx
│   │   └── TravelProcess.tsx
│   └── admin/
│       ├── LeadsTable.tsx
│       ├── DataTable.tsx
│       ├── StatsCard.tsx
│       └── RichTextEditor.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   ← Browser client
│   │   ├── server.ts                   ← Server client
│   │   └── middleware.ts
│   ├── email/
│   │   └── resend.ts
│   └── utils.ts
├── types/
│   └── database.ts                     ← Supabase generated types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql      ← All tables + RLS policies
├── public/
│   └── images/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── vercel.json
└── package.json
```

---

## 🗃️ Extra Files jo banana zaroori hai

| File | Purpose |
|------|---------|
| `supabase/migrations/001_initial_schema.sql` | Saare tables + RLS policies |
| `types/database.ts` | Supabase se generate karo: `npx supabase gen types` |
| `lib/supabase/middleware.ts` | Admin routes protect karne ke liye |
| `vercel.json` | Build settings + environment config |
| `.env.local` | Saare keys |
| `app/sitemap.ts` | SEO ke liye auto sitemap |
