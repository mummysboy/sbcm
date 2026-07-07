"use client";

import { useEffect, useState } from "react";

// No existing online booking platform — the practice's current site links
// "Book Now" straight to a phone call, so that's the trusted fallback here too.
const CALL_TO_BOOK_URL = "tel:8313597779";

/** Full-screen notice shown once per browser session: this site is a demo. */
export default function DemoOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("demo-notice-dismissed")) setOpen(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("demo-notice-dismissed", "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Demo notice"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-6"
    >
      <div className="max-w-md text-center">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-brand-red">
          Please note
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold text-cream">
          This site is just a demo
        </h2>
        <p className="mt-4 text-cream/80">
          If you&rsquo;d like to book an appointment with Kristen Swegles at
          Santa Barbara Chinese Medicine, please call to schedule.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <a
            href={CALL_TO_BOOK_URL}
            className="bg-brand-red px-8 py-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-brand-red-dark"
          >
            Call to Book · (831) 359-7779
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="border border-cream/40 px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-cream/80 transition-colors hover:border-cream hover:text-cream"
          >
            Continue to the demo
          </button>
        </div>
      </div>
    </div>
  );
}
