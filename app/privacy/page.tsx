import Link from "next/link";

export const metadata = { title: "Privacy Policy — Santa Barbara Chinese Medicine" };

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <header className="border-b border-ink">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="font-display text-xl font-bold">
            Santa Barbara Chinese Medicine
          </Link>
          <span className="text-right font-sans text-xs uppercase tracking-[0.25em] text-ink-soft">
            Privacy policy
          </span>
        </div>
      </header>
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10 leading-relaxed text-ink-soft">
        <h1 className="font-display text-3xl font-bold text-ink">Privacy Policy</h1>
        <p>
          Santa Barbara Chinese Medicine (924 Anacapa St, Suite 3D, Santa
          Barbara, CA 93101) collects your name and mobile phone number for
          one purpose only: managing the appointment you book with us online.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">Text messages</h2>
        <p>
          When you book an appointment and provide your phone number, you
          consent to receive appointment-related text messages from us: a
          booking confirmation, a reminder about 2 hours before your
          appointment, and notices if your appointment is changed or
          cancelled. Message frequency varies with your appointments. Message
          and data rates may apply. Reply <strong>STOP</strong> at any time to
          stop receiving texts, or <strong>HELP</strong> for help. You can also
          call us at (831) 359-7779.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">What we don&rsquo;t do</h2>
        <p>
          We do not send marketing or promotional messages. We do not sell,
          rent, or share your name or phone number with any third party for
          marketing purposes. No mobile information will be shared with third
          parties or affiliates for marketing or promotional purposes.
        </p>
        <h2 className="font-display text-xl font-bold text-ink">Data retention</h2>
        <p>
          Booking records are kept so we can manage your current and future
          appointments. To have your information removed, call or text
          (831) 359-7779 and we&rsquo;ll delete it.
        </p>
        <p className="text-sm">
          Questions? Call (831) 359-7779 or visit us at 924 Anacapa St, Suite
          3D, Santa Barbara, CA 93101.
        </p>
      </div>
    </main>
  );
}
