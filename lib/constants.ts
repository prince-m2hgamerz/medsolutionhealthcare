export const SITE = {
  name: "Asians Healthcare",
  tagline: "Your Trusted Partner in Medical Tourism",
  description:
    "Asians Healthcare connects you with top hospitals and doctors in India for world-class medical treatments at affordable prices.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://asianshealthcare.com",
  phone: "+91-9650928250",
  whatsapp: "919650928250",
  email: "info@asianshealthcare.com",
  address: "India",
} as const;

export const SOCIAL = {
  facebook: "https://facebook.com/asianshealthcare",
  twitter: "https://twitter.com/asianshealthcare",
  instagram: "https://instagram.com/asianshealthcare",
  linkedin: "https://linkedin.com/company/asianshealthcare",
  youtube: "https://youtube.com/@asianshealthcare",
} as const;

export const CONTACT = {
  phone: SITE.phone,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  consultationEmail: "consult@asianshealthcare.com",
  supportEmail: "support@asianshealthcare.com",
} as const;

export const WHATSAPP_MESSAGE = {
  default: "Hi! I'm interested in medical treatment in India. Can you help me?",
  consultation: "Hi! I'd like to book a free consultation. Please help me.",
  callback: "Hi! I'd like to request a callback. Please contact me.",
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  treatments: "/treatments",
  hospitals: "/hospitals",
  doctors: "/doctors",
  blog: "/blog",
  contact: "/contact",
  faq: "/faq",
  testimonials: "/testimonials",
  costCalculator: "/cost-calculator",
  privacyPolicy: "/privacy-policy",
  terms: "/terms",
} as const;

export const SPECIALTIES = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Oncology",
  "Gastroenterology",
  "Urology",
  "Nephrology",
  "Pulmonology",
  "Ophthalmology",
  "ENT",
  "Dermatology",
  "Gynecology",
  "Pediatrics",
  "Psychiatry",
  "Dentistry",
  "Cosmetic Surgery",
  "Bariatric Surgery",
  "Spine Surgery",
  "Liver Transplant",
  "Kidney Transplant",
  "Hip Replacement",
  "Knee Replacement",
  "IVF Treatment",
  "Cancer Treatment",
] as const;

export const COUNTRIES = [
  "Afghanistan",
  "Bangladesh",
  "Bhutan",
  "Botswana",
  "Cambodia",
  "Cameroon",
  "Canada",
  "China",
  "Egypt",
  "Ethiopia",
  "Gambia",
  "Ghana",
  "India",
  "Indonesia",
  "Iraq",
  "Kenya",
  "Kuwait",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mauritius",
  "Myanmar",
  "Nepal",
  "Nigeria",
  "Oman",
  "Pakistan",
  "Philippines",
  "Qatar",
  "Rwanda",
  "Saudi Arabia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sri Lanka",
  "Sudan",
  "Tanzania",
  "Thailand",
  "Uganda",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Yemen",
  "Zambia",
  "Zimbabwe",
] as const;

export const META = {
  home: {
    title: "Asians Healthcare - Best Medical Tourism in India",
    description:
      "Asians Healthcare offers world-class medical treatments in India. Connect with top hospitals, doctors, and affordable healthcare services.",
  },
} as const;
