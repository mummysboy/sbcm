"use client";

import { useState, useTransition } from "react";
import { adminCancelBooking, adminSetBookingStatus } from "../actions";

export default function AgendaActions({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const buttonClass =
    "border px-3 py-1.5 font-sans text-xs uppercase tracking-[0.15em] transition-colors disabled:opacity-40";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => adminSetBookingStatus(bookingId, "completed"))}
        className={`${buttonClass} border-ink hover:bg-ink hover:text-sand`}
      >
        Done
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => adminSetBookingStatus(bookingId, "no_show"))}
        className={`${buttonClass} border-ink-soft/50 text-ink-soft hover:bg-ink-soft hover:text-sand`}
      >
        No-show
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!confirmingCancel) {
            setConfirmingCancel(true);
            return;
          }
          startTransition(() => adminCancelBooking(bookingId));
        }}
        className={`${buttonClass} ${
          confirmingCancel
            ? "border-brand-gold bg-brand-gold text-sand hover:bg-brand-gold-dark"
            : "border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-sand"
        }`}
      >
        {confirmingCancel ? "Confirm — texts client" : "Cancel"}
      </button>
    </div>
  );
}
