import Link from "next/link";
import { supabaseAdmin } from "@/lib/db";
import type { BusinessHours, Service } from "@/lib/types";
import TestimonialCarousel from "./TestimonialCarousel";

export const revalidate = 300;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CONDITIONS = [
  "Allergies",
  "Asthma",
  "Back pain",
  "Carpal tunnel",
  "Chronic pain",
  "Depression",
  "Digestive issues",
  "Headaches",
  "High blood pressure",
  "Immune issues",
  "Insomnia",
  "Menopause",
  "Sports injuries",
  "And more",
];

const INSURANCE_ACCEPTED = ["United", "Aetna", "Anthem", "Blue Shield", "Cigna", "Kaiser"];

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
}

function price(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function HomePage() {
  const db = supabaseAdmin();
  const [{ data: services }, { data: hours }] = await Promise.all([
    db.from("services").select("*").eq("active", true).order("sort_order"),
    db.from("business_hours").select("*").order("weekday"),
  ]);

  const hasPublishedHours = ((hours ?? []) as BusinessHours[]).some((h) => h.is_open);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b border-ink bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
          <img
            src="/logo.png"
            alt="Santa Barbara Chinese Medicine"
            className="mx-auto h-auto w-64 sm:w-80"
          />
          <h1 className="sr-only">Santa Barbara Chinese Medicine</h1>
          <p className="mt-3 font-sans text-sm font-medium uppercase tracking-[0.5em] text-ink-soft sm:text-base">
            Kristen Swegles, LAc, MTCM, CMP
          </p>
          <div className="hairline mx-auto mt-10 w-24" />
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ink-soft italic">
            &ldquo;Activate and replenish your body&rsquo;s &lsquo;Qi&rsquo; for
            optimal health!&rdquo;
          </p>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            A functional integrative practice providing traditional Chinese
            medicine services — acupuncture, herbal remedies, massage, and
            lifestyle therapies — with customized, individual patient care.
          </p>
          <Link
            href="/book"
            className="mt-10 inline-block bg-brand-gold px-10 py-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-sand transition-colors hover:bg-brand-gold-dark"
          >
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Services</h2>
        <div className="hairline mx-auto mt-6 w-16" />
        <p className="mx-auto mt-6 max-w-lg text-center text-sm text-ink-soft">
          Complimentary consultations available.
        </p>
        <ul className="mt-12 space-y-8">
          {((services ?? []) as Service[]).map((s) => (
            <li key={s.id}>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-xl font-semibold text-plum">{s.name}</span>
                <span
                  aria-hidden
                  className="flex-1 border-b border-dotted border-ink-soft/50"
                />
                <span className="font-display text-xl">
                  {s.price_cents > 0 ? price(s.price_cents) : "Inquire"}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                {s.description}
                {s.price_cents > 0 ? ` · ${s.duration_min} min` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Conditions treated */}
      <section className="border-t border-ink bg-sand">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
            Conditions We Treat
          </h2>
          <div className="hairline mx-auto mt-6 w-16" />
          <ul className="mx-auto mt-12 grid max-w-xl grid-cols-2 gap-x-8 gap-y-3 text-ink-soft sm:grid-cols-3">
            {CONDITIONS.map((c) => (
              <li key={c} className="text-center text-sm">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Meet Kristen */}
      <section className="border-t border-ink">
        <div className="mx-auto grid max-w-4xl items-center gap-10 px-6 py-20 sm:grid-cols-[220px_1fr]">
          <img
            src="/kristen-headshot.jpg"
            alt="Kristen Swegles, LAc, MTCM, CMP"
            className="soft-frame mx-auto aspect-[3/4] w-48 object-cover sm:w-full"
          />
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Meet Kristen
            </h2>
            <div className="hairline mt-6 w-16" />
            <p className="mt-6 leading-relaxed text-ink-soft">
              Kristen Swegles, LAc, MTCM, CMP brings a functional, integrative
              approach to traditional Chinese medicine — combining
              acupuncture, herbal medicine, and lifestyle therapies into
              customized care for each patient.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="border-t border-ink bg-sand-dark">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Gallery</h2>
          <div className="hairline mx-auto mt-6 w-16" />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { src: "/gallery-waiting-area.jpg", alt: "Waiting area at Santa Barbara Chinese Medicine" },
              { src: "/gallery-hallway.jpg", alt: "Office hallway with a traditional longevity symbol" },
              { src: "/gallery-treatment-room.jpg", alt: "Treatment room at Santa Barbara Chinese Medicine" },
            ].map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                className="soft-frame aspect-[3/4] w-full object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-ink">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">What Patients Say</h2>
          <div className="hairline mx-auto mt-6 w-16" />
          <a
            href="https://www.yelp.com/biz/kristen-swegles-lac-mtcm-cmp-santa-barbara"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block font-sans text-xs uppercase tracking-[0.2em] text-brand-gold underline"
          >
            5.0 ★ · 20 reviews on Yelp
          </a>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Insurance & consultations */}
      <section className="border-t border-ink bg-sand">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Insurance &amp; Consultations
          </h2>
          <div className="hairline mx-auto mt-6 w-16" />
          <p className="mx-auto mt-8 max-w-xl leading-relaxed text-ink-soft">
            New patients are welcome to a complimentary consultation to discuss
            your health goals before booking a full appointment.
          </p>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-soft">
            We accept the following insurance plans: {INSURANCE_ACCEPTED.join(", ")}.
          </p>
        </div>
      </section>

      {/* Visit */}
      <section className="border-t border-ink bg-sand-dark">
        <div className="mx-auto grid max-w-4xl gap-12 px-6 py-20 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Visit the Office</h2>
            <div className="hairline mt-6 w-16" />
            <p className="mt-8 leading-relaxed text-ink-soft">
              924 Anacapa St, Suite 3D
              <br />
              Santa Barbara, CA 93101
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Call or text:{" "}
              <a className="underline decoration-brand-gold" href="tel:+18313597779">
                (831) 359-7779
              </a>
            </p>
            <p className="mt-1 leading-relaxed text-ink-soft">
              Office:{" "}
              <a className="underline decoration-brand-gold" href="tel:+18057295270">
                (805) 729-5270
              </a>
            </p>
            <p className="mt-1 leading-relaxed text-ink-soft">
              Email:{" "}
              <a
                className="underline decoration-brand-gold"
                href="mailto:kristenswegles@gmail.com"
              >
                kristenswegles@gmail.com
              </a>
            </p>
            <a
              className="mt-4 inline-block font-sans text-xs uppercase tracking-[0.2em] text-brand-gold underline"
              href="https://maps.google.com/?q=924+Anacapa+St+Suite+3D,+Santa+Barbara,+CA+93101"
              target="_blank"
              rel="noreferrer"
            >
              Get directions
            </a>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold">Hours</h2>
            <div className="hairline mt-6 w-16" />
            {hasPublishedHours ? (
              <ul className="mt-8 space-y-2 text-ink-soft">
                {((hours ?? []) as BusinessHours[]).map((h) => (
                  <li key={h.weekday} className="flex justify-between gap-6">
                    <span>{WEEKDAYS[h.weekday]}</span>
                    <span>
                      {h.is_open
                        ? `${formatTime(h.open_time)} – ${formatTime(h.close_time)}`
                        : "Closed"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              // TODO: hours haven't been published anywhere yet. Set real
              // hours in /admin/schedule, after which this falls back to the
              // dynamic weekly list above automatically.
              <p className="mt-8 leading-relaxed text-ink-soft">
                By appointment — hours coming soon. Please call{" "}
                <a className="underline decoration-brand-gold" href="tel:+18313597779">
                  (831) 359-7779
                </a>{" "}
                to schedule.
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-ink py-10 text-center font-sans text-xs uppercase tracking-[0.25em] text-ink-soft">
        <p>
          Santa Barbara Chinese Medicine · 924 Anacapa St Suite 3D, Santa
          Barbara, CA 93101 ·{" "}
          <Link href="/book" className="text-brand-gold underline">
            Book online
          </Link>
        </p>
        <p className="mt-4 flex items-center justify-center gap-6 normal-case tracking-normal">
          <a
            href="https://www.instagram.com/kristenswegles/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-gold underline"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/kristenswegleslac"
            target="_blank"
            rel="noreferrer"
            className="text-brand-gold underline"
          >
            Facebook
          </a>
          <a
            href="https://www.yelp.com/biz/kristen-swegles-lac-mtcm-cmp-santa-barbara"
            target="_blank"
            rel="noreferrer"
            className="text-brand-gold underline"
          >
            Yelp
          </a>
        </p>
      </footer>
    </main>
  );
}
