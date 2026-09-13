# FSP Terminology

Medical German terminology training platform for the Fachsprachprüfung (FSP), built with
Next.js (App Router), Prisma + Postgres, and Paddle Billing for subscriptions.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in real values — see comments in that file
npx prisma migrate dev --name init
npm run dev
```

**Important — start with a fresh database.** This project previously had an experimental,
incompatible Prisma toolchain mixed in (leftover files/config from testing a different
Prisma product), which is fully removed now, but if you're pointing at the same Postgres
database that toolchain touched, create a **new** database (e.g. a new Neon project) rather
than reusing the old one, to rule out any leftover inconsistent state.

After deploying, visit `/api/health` to confirm the database connection and every required
environment variable are actually configured — check this before testing the full checkout
flow, so a config problem shows up immediately instead of as a confusing failure three
steps into the funnel.

## Authentication

Checkout collects an email and creates an account automatically (frictionless first
purchase, per the original product brief). Returning users on a new device log in via
`/login` using a one-time 6-digit code emailed through Resend — configure `RESEND_API_KEY`
and `EMAIL_FROM`. Codes expire after 10 minutes and are limited to 5 attempts.

## Payments

Paddle Billing, as merchant of record (handles VAT/sales tax globally, and supports sellers
based in Algeria, unlike Stripe). Subscription status is **only ever** written by the
signature-verified webhook at `/api/webhooks/paddle` — never by the client. See that file's
comments for exactly which Paddle events are handled and why.

If a webhook event is missing `customData.userId`, the handler now returns a `422` and logs
the raw payload, instead of silently returning `200` with no database write — so a
config/integration mismatch is visible immediately in Paddle's delivery log and your
server logs, not hidden as a false "Delivered" success.

## Database schema

`prisma/schema.prisma` is the single source of truth. To change it: edit the file, then run
`npx prisma migrate dev --name <description>` to generate and apply a migration. Do not
install or run any other Prisma-branded CLI/package beyond `prisma` and `@prisma/client` —
mixing toolchains is what caused the original database errors this rebuild fixed.

## Deployment

Vercel + a custom domain. See the project's deployment notes for the full checklist
(environment variables, Paddle webhook URL, DNS, going live with real Paddle credentials).
