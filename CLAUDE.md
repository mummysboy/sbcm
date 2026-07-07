@AGENTS.md

# Santa Barbara Chinese Medicine

Site + custom booking engine for Kristen Swegles, LAc, MTCM, CMP — a
functional integrative traditional Chinese medicine practice (acupuncture,
herbal remedies, massage, and lifestyle therapies) at 924 Anacapa St Suite
3D, Santa Barbara, CA 93101. Built from the `momothebarber` template (see
`../momothebarber` and `../CLAUDE.md` in `bookingsites/` for the canonical
reference implementation this was copied from).

TODO: not yet deployed. No domain, Vercel project, Supabase project, or
Twilio number/Messaging Service exist yet — see "Not yet provisioned" below.

## Stack

- Next.js 16 App Router + Tailwind v4 (see AGENTS.md — read bundled docs first)
- Supabase Postgres + Auth. **Server-only DB access via service-role key** — no
  anon/RLS client access. TODO: no Supabase project created yet.
- Twilio SMS via Messaging Service with **scheduled messages** (`sendAt`,
  ≥16-min lead) for the 2h-before client reminder and the 45-min-before
  "hasn't confirmed" owner alert — no cron anywhere. TODO: no Twilio account/
  number/Messaging Service created yet.
- Deploys: Vercel (planned). TODO: no domain purchased/confirmed yet —
  `santabarbarachinesemedicine.com` is used as a placeholder throughout this
  template until a real domain is chosen.

## Branding

momothebarber's visual identity (brand-red `#8c2f2f` + gold, art-deco
double-rule/outline-offset dividers, a real barbershop logo + gallery photos)
was a barbershop aesthetic and didn't belong on this site — an earlier pass
had carried it over verbatim along with a couple of Momo's actual hardcoded
strings (his real phone number in the `/b/[token]` "booking not found"
message, his real logo/gallery JPEGs in `public/`). Both are fixed:

- **Momo's real assets were deleted**, not left as "placeholders":
  `public/logo-mark.jpg`, `public/logo-booksy.jpg`, `public/gallery/cut-*.jpg`
  are gone.
- **Real branding assets since added**: `public/logo.png` (her actual gold
  yin-yang logo) and `public/kristen-headshot.jpg` (her real headshot) were
  pulled from kristenswegles.com and are wired into the hero and a new "Meet
  Kristen" section. `public/gallery-*.jpg` (waiting area, hallway, treatment
  room) are real photos of her actual office, sourced from her Instagram
  (@kristenswegles) with her permission — the Gallery section now shows
  these three instead of placeholders.
- **New palette** in `app/globals.css` (`--sand`/`--sand-dark` background,
  `--ink`/`--ink-soft` text, `--sage`/`--sage-dark` primary accent,
  `--clay` secondary accent) replaces the old cream/red/gold barbershop
  scheme — sage green and warm sand read calm and natural for a TCM/wellness
  practice, not vintage-barbershop-red. `.deco-rule`/`.deco-frame` (double
  border, outline-offset) were replaced with `.hairline` (single thin rule)
  and `.soft-frame` (rounded single border). Playfair Display + Inter fonts
  were kept — that was a content/color problem, not a font problem.
- `app/opengraph-image.tsx` no longer reads a logo JPEG off disk; it's a
  pure-Satori card in the new palette.

## Commands

Node ≥22 required (nvm default is 20 and breaks supabase-js). Prefix every
npm/node/vercel command with:

```sh
export PATH="/opt/homebrew/opt/node@23/bin:$PATH"
```

- `npm run dev` — dev server (uses `.env.local`, points at local Supabase)
- `npm run build` / `npm run lint`
- `supabase start` — local stack, API port **55521**, Postgres **55522**
  (`psql postgresql://postgres:postgres@127.0.0.1:55522/postgres`). Ports are
  offset +100 from the momothebarber template's defaults so both projects'
  local Supabase stacks can run side by side.
- One-off TS scripts: use **`.mts`** extension with tsx (top-level await fails
  in `.ts`/CJS mode)
- Prod DB changes: once a Supabase project exists, use the MCP supabase tools
  (`apply_migration`, `execute_sql`) against it; also add the file under
  `supabase/migrations/` and apply locally via psql.

## Architecture

- `lib/availability.ts` — slot generation in practice TZ (America/Los_Angeles);
  15-min granularity, lead time + max-advance from `settings` row.
- `lib/booking.ts` — create/cancel/reschedule server logic + all SMS
  composition. Key exports: `createBooking`, `cancelBooking`,
  `rescheduleBooking`, `confirmFromSms`, `relayInboundToOwner`,
  `notifyOwner`. Constants: reminder −120 min, owner alert −45 min.
- `lib/sms.ts` — single SMS gateway. **Outbox mode:** when Twilio env vars are
  unset, messages are written to the `sms_outbox` table instead of sent —
  local dev tests the full flow without Twilio.
- `app/api/sms/route.ts` — Twilio inbound webhook. Validates
  `X-Twilio-Signature` (skipped when `TWILIO_AUTH_TOKEN` unset). Body matching
  `/^y(es)?[.!]*$/i` → confirm booking; anything else → relay text to owner
  (Kristen).
- `app/book/` — public 3-step booking flow. `app/b/[token]/` — self-serve
  cancel/reschedule (link sent in confirmation SMS). `app/admin/` — dashboard
  (agenda, schedule/blocks, services), Supabase Auth email/password.
- Double-booking is impossible at the DB level: btree_gist exclusion
  constraint on confirmed bookings.
- The homepage's `DemoOverlay` currently points its fallback CTA at
  `tel:8313597779` (call to book) rather than a third-party booking platform —
  this practice has no existing online booking system to fall back to.

## SMS / notification flow

1. Booking → client confirmation ("Reply Y to confirm" + manage link) +
   owner new-booking text (web bookings only, not admin-created).
2. Two scheduled messages: client reminder at −2h, owner alert at −45min if
   client hasn't replied Y. SIDs stored on the booking
   (`reminder_sid`, `owner_alert_sid`) so cancel/reschedule can revoke them.
3. Client replies Y → `customer_confirmed_at` set, owner alert cancelled,
   owner gets "Confirmed:" text. Non-Y replies are forwarded to the owner.
4. Owner phone comes from `settings.owner_phone` — TODO: seeded with
   Kristen's mobile (+18313597779); confirm before going live.

## Not yet provisioned

These are real, billable, account-level resources — confirm with the
business owner before creating any of them:

- **Supabase project** — apply `supabase/migrations/` to it once created.
- **Vercel project + domain** — no domain has been purchased/confirmed;
  `santabarbarachinesemedicine.com` is a placeholder used in metadata,
  `.env.example`, and the OG image.
- **Twilio number + Messaging Service** — with A2P 10DLC registration
  (sole-proprietor/LLC registration, same pattern as the momothebarber
  reference). Until then, all SMS logs to the `sms_outbox` table.

## Gotchas

- JSX collapses whitespace at line breaks around inline elements — use
  explicit `{" "}` (a missing space after `<strong>Y</strong>` shipped once
  on the reference implementation).
- `app/opengraph-image.tsx` (Satori): no mix-blend-multiply, no woff2; fonts
  fetched as TTF from Google Fonts CSS via plain (non-browser-UA) fetch.
- Never commit secrets. Twilio + Supabase prod keys belong in Vercel env vars
  once those projects exist.
- **Known data gaps** (see also root `bookingsites/CLAUDE.md` intake): hours
  were not published anywhere the source site/Yelp could confirm, so
  `business_hours` is seeded all-closed — a TODO for Kristen to fill in via
  `/admin/schedule` before launch.
- **Pricing is estimated, not real**: `services.price_cents` in
  `supabase/migrations/0001_initial_schema.sql` (2026-07-07) is set to
  market rate + 10% per service, based on a comparable Santa Barbara
  practice (Santa Barbara Herb Clinic's published rates) and national
  averages for cupping/moxibustion/gua sha/tui na/reiki/cosmetic
  acupuncture — Isaac's placeholder per the business owner's instruction,
  not Kristen's actual rates. Confirm/adjust via `/admin/services` before
  launch.
- **Possible address change, unconfirmed**: several recent Instagram posts
  (Jan/Feb 2026, referencing a Feb 3, 2026 open house) list the practice's
  address as "1900 State St., Suite C, Santa Barbara, CA (formerly known as
  CCOM)" and one caption mentions "my new office in the Julia building
  downtown" — different from 924 Anacapa St Suite 3D, which is what's on
  kristenswegles.com and the Instagram bio. Isaac chose to keep 924 Anacapa
  St site-wide for now (2026-07-07) rather than guess. Confirm the current
  address with Kristen before launch — it's used in the hero, footer, SMS
  templates, Supabase seed data, and the Google Maps link.
