import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/layout/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import DoctorsClient from "./DoctorsClient";
import { allDoctors, type Doctor } from "@/lib/doctors-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Specialist Doctors in India | Apollo, Max, Medanta, BLK-Max & More",
  description: `Browse ${allDoctors.length}+ specialist doctors from India's top hospitals — Apollo, Max, Medanta, BLK-Max, Artemis and Paras. Filter by specialty, hospital, and gender.`,
  alternates: { canonical: "https://medsolutionhealthcare.com/doctors" },
};

export default async function DoctorsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: dbDoctors } = await supabase
    .from("doctors")
    .select("slug, qualifications, photo_url, specialties")
    .limit(500);

  const hasSupabaseData = !!dbDoctors && dbDoctors.length > 0;
  let doctors: Doctor[] | undefined;

  if (hasSupabaseData) {
    const dbMap = new Map(dbDoctors.map((d) => [d.slug, d]));
    doctors = allDoctors.map((d) => {
      const db = dbMap.get(d.slug);
      if (!db) return d;
      return {
        ...d,
        qualifications: db.qualifications || d.qualifications,
        photo_url: db.photo_url || d.photo_url,
        specialty: db.specialties?.[0] || d.specialty,
      };
    });
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Doctors", url: "https://medsolutionhealthcare.com/doctors" },
      ])} />
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Doctors", href: "/doctors" },
      ]} />
      <PageHero
        eyebrow="Our Experts"
        title="Find Your Specialist"
        description={`${allDoctors.length}+ top doctors from India's leading hospitals — filter by specialty, hospital, or gender to find the right expert for you.`}
       />

      <Suspense fallback={
        <div className="container-cinematic py-20 text-center text-shade-50">
          Loading doctors...
        </div>
      }>
        <DoctorsClient doctors={doctors} />
      </Suspense>
    </>
  );
}
