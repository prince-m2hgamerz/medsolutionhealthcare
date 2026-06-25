import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  country: string;
  treatment: string;
  text: string;
  rating: number;
  videoId?: string;
}

export default function PatientTestimonials({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  const visible = testimonials.slice(0, 6);

  return (
    <section className="bg-surface py-12 sm:py-huge">
      <div className="container-cinematic">
        <div className="text-center mb-12">
          <span className="pill-tag mb-4 inline-block">Patient Stories</span>
          <h2 className="font-display text-display-md lg:text-display-lg mt-4 text">What Our Patients Say</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-6 flex flex-col shadow-elevation-1">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, ri) => (
                  <Star key={ri} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-body-md text-shade-50 leading-relaxed mb-4 flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <div>
                <p className="text-body-md font-medium text">{t.name}</p>
                <p className="text-caption text-shade-40">{t.country} &middot; {t.treatment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
