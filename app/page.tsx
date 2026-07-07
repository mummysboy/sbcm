import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/db";
import type { BusinessHours, Service } from "@/lib/types";

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
      <section className="border-b border-ink bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
          {/* TODO: swap for Santa Barbara Chinese Medicine's real logo — this is
              still the momothebarber template placeholder mark. */}
          <Image
            src="/logo-mark.jpg"
            alt="Santa Barbara Chinese Medicine logo"
            width={130}
            height={103}
            priority
            className="mx-auto mix-blend-multiply"
          />
          <div
            aria-hidden
            className="mx-auto mt-4 flex w-40 items-center gap-3 text-[#263248]"
          >
            <span className="h-px flex-1 bg-[#263248]" />
            <span className="text-xs leading-none">★</span>
            <span className="h-px flex-1 bg-[#263248]" />
          </div>
          <h1 className="mt-5 font-sans text-4xl font-black uppercase tracking-[0.06em] text-[#263248] sm:text-6xl">
            Santa Barbara Chinese Medicine
          </h1>
          <p className="mt-3 font-sans text-sm font-medium uppercase tracking-[0.5em] text-[#263248]/80 sm:text-base">
            Kristen Swegles, LAc, MTCM, CMP
          </p>
          <div className="deco-rule mx-auto mt-10 w-24" />
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ink-soft italic">
            &ldquo;Activate and replenish your body&rsquo;s &lsquo;qi&rsquo; for
            optimal health!&rdquo;
          </p>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            A functional integrative practice providing traditional Chinese
            medicine services — acupuncture, herbal remedies, massage, and
            lifestyle therapies — with customized, individual patient care.
          </p>
          <Link
            href="/book"
            className="mt-10 inline-block bg-brand-red px-10 py-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-brand-red-dark"
          >
            Book an Appointment
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Services</h2>
        <div className="deco-rule mx-auto mt-6 w-16" />
        <p className="mx-auto mt-6 max-w-lg text-center text-sm text-ink-soft">
          Complimentary consultations available.{" "}
          {/* TODO: pricing hasn't been published anywhere — publish real rates
              in /admin/services, then this note (and the "Inquire" labels
              below) can be removed. */}
          Pricing available by phone or in person — call to ask about a
          specific service.
        </p>
        <ul className="mt-12 space-y-8">
          {((services ?? []) as Service[]).map((s) => (
            <li key={s.id}>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-xl font-semibold">{s.name}</span>
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
      <section className="border-t border-ink bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
            Conditions We Treat
          </h2>
          <div className="deco-rule mx-auto mt-6 w-16" />
          <ul className="mx-auto mt-12 grid max-w-xl grid-cols-2 gap-x-8 gap-y-3 text-ink-soft sm:grid-cols-3">
            {CONDITIONS.map((c) => (
              <li key={c} className="text-center text-sm">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      {/* TODO: these are still the momothebarber template's placeholder
          barbershop photos. Replace with real photos of Kristen, the office
          at 924 Anacapa St, and the practice once supplied. */}
      <section className="border-t border-ink bg-cream-dark">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Gallery</h2>
          <div className="deco-rule mx-auto mt-6 w-16" />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="deco-frame overflow-hidden">
                <Image
                  src={`/gallery/cut-${n}.jpg`}
                  alt="Santa Barbara Chinese Medicine — placeholder photo, TODO replace"
                  width={585}
                  height={780}
                  className="aspect-[3/4] w-full object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm italic text-ink-soft">
            Photos coming soon.
          </p>
        </div>
      </section>

      {/* Insurance & consultations */}
      <section className="border-t border-ink">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Insurance &amp; Consultations
          </h2>
          <div className="deco-rule mx-auto mt-6 w-16" />
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
      <section className="border-t border-ink bg-cream-dark">
        <div className="mx-auto grid max-w-4xl gap-12 px-6 py-20 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Visit the Office</h2>
            <div className="deco-rule mt-6 w-16" />
            <p className="mt-8 leading-relaxed text-ink-soft">
              924 Anacapa St, Suite 3D
              <br />
              Santa Barbara, CA 93101
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Call or text:{" "}
              <a className="underline decoration-brand-red" href="tel:+18313597779">
                (831) 359-7779
              </a>
            </p>
            <p className="mt-1 leading-relaxed text-ink-soft">
              Office:{" "}
              <a className="underline decoration-brand-red" href="tel:+18057295270">
                (805) 729-5270
              </a>
            </p>
            <p className="mt-1 leading-relaxed text-ink-soft">
              Email:{" "}
              <a
                className="underline decoration-brand-red"
                href="mailto:kristenswegles@gmail.com"
              >
                kristenswegles@gmail.com
              </a>
            </p>
            <a
              className="mt-4 inline-block font-sans text-xs uppercase tracking-[0.2em] text-brand-red underline"
              href="https://maps.google.com/?q=924+Anacapa+St+Suite+3D,+Santa+Barbara,+CA+93101"
              target="_blank"
              rel="noreferrer"
            >
              Get directions
            </a>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold">Hours</h2>
            <div className="deco-rule mt-6 w-16" />
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
                <a className="underline decoration-brand-red" href="tel:+18313597779">
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
          <Link href="/book" className="text-brand-red underline">
            Book online
          </Link>
        </p>
        <p className="mt-4 flex items-center justify-center gap-6 normal-case tracking-normal">
          <a
            href="https://www.instagram.com/kristenswegles/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-red underline"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/kristenswegleslac"
            target="_blank"
            rel="noreferrer"
            className="text-brand-red underline"
          >
            Facebook
          </a>
          <a
            href="https://www.yelp.com/biz/kristen-swegles-lac-mtcm-cmp-santa-barbara"
            target="_blank"
            rel="noreferrer"
            className="text-brand-red underline"
          >
            Yelp
          </a>
        </p>
      </footer>
    </main>
  );
}
