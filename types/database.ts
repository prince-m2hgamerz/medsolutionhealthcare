export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      doctors: { Row: Doctor; Insert: Partial<Doctor>; Update: Partial<Doctor> };
      hospitals: { Row: Hospital; Insert: Partial<Hospital>; Update: Partial<Hospital> };
      treatments: { Row: Treatment; Insert: Partial<Treatment>; Update: Partial<Treatment> };
      doctor_hospital: { Row: DoctorHospital; Insert: Partial<DoctorHospital>; Update: Partial<DoctorHospital> };
      specialties: { Row: Specialty; Insert: Partial<Specialty>; Update: Partial<Specialty> };
      doctor_specialties: { Row: DoctorSpecialty; Insert: Partial<DoctorSpecialty>; Update: Partial<DoctorSpecialty> };
      blogs: { Row: Blog; Insert: Partial<Blog>; Update: Partial<Blog> };
      insurance_companies: { Row: InsuranceCompany; Insert: Partial<InsuranceCompany>; Update: Partial<InsuranceCompany> };
      hotels: { Row: Hotel; Insert: Partial<Hotel>; Update: Partial<Hotel> };
      testimonials: { Row: Testimonial; Insert: Partial<Testimonial>; Update: Partial<Testimonial> };
      leads: { Row: Lead; Insert: Partial<Lead>; Update: Partial<Lead> };
      admin_users: { Row: AdminUser; Insert: Partial<AdminUser>; Update: Partial<AdminUser> };
      site_settings: { Row: SiteSetting; Insert: Partial<SiteSetting>; Update: Partial<SiteSetting> };
    };
  };
}

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
  experience_years: number;
  hospital_id: string | null;
  specialties: string[];
  qualifications: string;
  about: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  city: string;
  state: string;
  beds_count: number;
  accreditations: string[];
  about: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Treatment {
  id: string;
  name: string;
  slug: string;
  category: string;
  cost_usd_min: number;
  cost_usd_max: number;
  description: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface DoctorHospital {
  doctor_id: string;
  hospital_id: string;
}

export interface Specialty {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  description: string | null;
}

export interface DoctorSpecialty {
  doctor_id: string;
  specialty_id: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  thumbnail_url: string | null;
  author: string;
  published_at: string;
  is_published: boolean;
}

export interface InsuranceCompany {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  hospital_id: string;
  stars: number;
  price_range: string;
  booking_url: string | null;
  photo_url: string | null;
}

export interface Testimonial {
  id: string;
  patient_name: string;
  country: string;
  treatment: string;
  video_url: string | null;
  text_content: string;
  rating: number;
  is_approved: boolean;
}

export interface Lead {
  id: string;
  form_type: string;
  name: string;
  age: number | null;
  gender: string | null;
  country: string;
  phone: string;
  email: string | null;
  medical_condition: string | null;
  doctor_preference: string | null;
  insurance_company: string | null;
  message: string | null;
  file_url: string | null;
  status: "new" | "contacted" | "converted" | "closed";
  notes: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "super_admin" | "editor" | "viewer";
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}
