-- Reply-Y confirmations + owner (practitioner) SMS notifications.
alter table public.bookings
  add column if not exists customer_confirmed_at timestamptz,
  -- SID of the scheduled "client hasn't confirmed" text to the practitioner,
  -- so it can be cancelled the moment the client replies Y (or the booking
  -- is cancelled).
  add column if not exists owner_alert_sid text;

-- Kristen's mobile for booking/confirmation/no-reply alerts. TODO: confirm
-- before going live.
alter table public.settings
  add column if not exists owner_phone text not null default '+18313597779';
