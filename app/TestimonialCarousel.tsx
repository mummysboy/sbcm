"use client";

import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Kristen is a very talented acupuncturist and healer! She is very very intuitive, and is especially gifted with women's health. I love her warm, inviting and beautifully decorated office. Kristen is a gift to our community and her system of acupuncture, herbs and other modalities will truly support your health and wellness goals.",
    name: "Paith M.",
  },
  {
    quote:
      "A serene atmosphere to receive acupuncture. Kristen has a natural healing presence and a very soft touch with the acupuncture needles which I appreciate :) It's a wonderful spot to tune in and recharge.",
    name: "Paul S.",
  },
  {
    quote:
      "I have had the good fortune to have been introduced to Kristen Swegles for acupuncture treatments for arm and hand pain. I found her very pleasant and her treatments to be effective in relieving pain. I will return to her for treatments and highly recommend her.",
    name: "Jennifer V.",
  },
  {
    quote:
      "I slept so well last night, no pain, and woke up well rested. Thank you so much for everything you do for me!",
    name: "Anna D.",
  },
  {
    quote: "We had a baby! I went into labor Monday, so whatever you did at our last session worked!",
    name: "Jett B.",
  },
  {
    quote:
      "I suffer from chronic nerve pain and am treated locally by an acupuncturist. When I visit Santa Barbara a few times each year, I make it a point to seek treatments from Kristen as often as time permits. She is very good at what she does and provides me with much needed relief.",
    name: "Rosemary L.",
  },
  {
    quote:
      "She's great! She's professional, thorough, and really knows her stuff. I felt very comfortable with her and also very cared for. I look forward to more acupuncture treatments!",
    name: "Bethany K.",
  },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[index];

  return (
    <div className="mx-auto mt-12 max-w-2xl text-center">
      <div key={index} className="fade-in-up">
        <p className="min-h-32 text-lg leading-relaxed text-ink-soft italic sm:min-h-24">
          &ldquo;{t.quote}&rdquo;
        </p>
        <p className="mt-4 font-sans text-xs uppercase tracking-[0.25em] text-brand-gold">
          {t.name}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
          className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-brand-gold"
        >
          ‹ Prev
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-brand-gold" : "bg-ink-soft/30"}`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
          className="font-sans text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-brand-gold"
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
