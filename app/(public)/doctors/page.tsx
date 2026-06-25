import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/layout/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import DoctorsClient from "./DoctorsClient";
import { allDoctors } from "@/lib/doctors-data";

export const metadata: Metadata = {
  title: "Specialist Doctors in India | Apollo, Max, Medanta, BLK-Max & More",
  description: `Browse ${allDoctors.length}+ specialist doctors from India's top hospitals — Apollo, Max, Medanta, BLK-Max, Artemis and Paras. Filter by specialty, hospital, and gender.`,
  alternates: { canonical: "https://asianshealthcare.com/doctors" },
};

export default async function DoctorsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://asianshealthcare.com" },
        { name: "Doctors", url: "https://asianshealthcare.com/doctors" },
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
        <DoctorsClient />
      </Suspense>
    </>
  );
}
