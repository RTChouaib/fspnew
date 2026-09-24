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

`prisma/schema.prisma` is the single source of truth. To change it:

1. Edit `schema.prisma`.
2. Run `npx prisma migrate dev --name <description>` locally, pointed at a dev database (not
   production — `migrate dev` can reset data if it detects drift). This generates a new
   folder under `prisma/migrations/` containing the actual SQL, and applies it to your local
   dev database.
3. **Commit the generated `prisma/migrations/<timestamp>_<description>/` folder.** This step
   is not optional — the migration only exists once it's a file in the repo. A schema.prisma
   change with no matching committed migration folder means production's real database never
   gets the change, even though the code that expects it is deployed and live. (This is
   exactly what happened with the case-simulation tables before this fix — the schema was
   edited but no migration was ever committed, so every page that queried those tables 500'd
   in production while working fine anywhere `prisma db push` or `migrate dev` had been run
   by hand.)
4. Push. `npm run build` now runs `prisma migrate deploy && next build` — Vercel applies any
   committed-but-not-yet-applied migrations automatically, before the app is built, on every
   deploy. No manual production DB step is ever required again as long as step 3 happened.

Do not install or run any other Prisma-branded CLI/package beyond `prisma` and
`@prisma/client` — mixing toolchains is what caused the original database errors this
rebuild fixed. Do not run `prisma db push` against production either — it skips the
migration-history table entirely, so subsequent `migrate deploy` runs won't know the change
already happened.

If you're ever unsure whether production's database actually matches `schema.prisma`, check
`/api/health` (confirms the connection works and required env vars are set, but not schema
drift specifically) or compare the table list in Neon's dashboard against the models in
`schema.prisma`.

## Deployment

Vercel + a custom domain. `npm run build` (`prisma migrate deploy && next build`) is what
Vercel runs on every deploy, so schema changes ship automatically as long as the migration
folder was committed. See the project's deployment notes for the rest of the checklist
(environment variables, Paddle webhook URL, DNS, going live with real Paddle credentials).

**Preview deployments:** if Vercel Preview builds point at the same `DATABASE_URL` as
Production (common for small projects with a single database), they will also run
`prisma migrate deploy` against that same production database on every preview build. This
is safe (migrations are additive and idempotent — deploy is a no-op if nothing's pending),
but worth knowing if you ever branch to a separate preview database: point Preview at its own
`DATABASE_URL` and this still works the same way, applying migrations to whichever database
that environment's `DATABASE_URL` points to.
