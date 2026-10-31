# Polish pass: what changed

Payment code (Polar checkout, webhooks, account API, pricing logic, session/auth/progress, Prisma schema and
migrations) and the subscription gating in `app/api/simulation/**` were **not modified**. The legacy Paddle webhook,
`lib/paddle.ts` and the Paddle columns are still in place; remove them only once you are sure no old Paddle
subscriptions exist.

## Code organization
- `app/globals.css` split into `styles/*.css` (base, components, marketing, app-shell, dashboard, learn, study, quiz,
  simulation), imported in `app/layout.tsx`. Cascade order is preserved; 56 unused rules were removed.
- Prettier added (`npm run format`); payment/API/data files are excluded in `.prettierignore`.
- Search runs on the server (`app/(app)/search/page.tsx`), so `data/terms.ts` is no longer shipped to the browser.
- `lib/requireUser.ts` replaces `(await getCurrentUserId())!` in app pages.
- Docs moved to `docs/`. Tests added: `lib/quiz.test.ts`, `lib/skillLabels.test.ts`, `lib/access.test.ts`
  (run with `npm test`; the access test skips itself if the Prisma client has not been generated).
- Renamed local variables called `module` (lint rule).

## App design
- Minimum text size raised (12px; 11px for uppercase labels) and low-contrast greys darkened to WCAG AA.
- Navigation: "Heute lernen" is primary; mobile tabs are Start, Heute, Lernplan, Gespräche, Mehr (sheet with Tests,
  Fehler, Kategorien, Suche, Konto). Sidebar gained Kategorien.
- Dashboard: duplicate start button removed; skills shown with readable labels (`lib/skillLabels.ts`).
- Quiz (test + demo): feedback with ✓/✗ text, explanation, "Weiter" button, keyboard (1-4, Enter), progress bars with
  `role="progressbar"`, save errors handled. Question options are now always unique (previous bug: duplicate answers).
- Added `loading.tsx`, `error.tsx` (uses `retry`, per Next 16), `not-found.tsx`; chat shows typing and evaluating states.

## Landing page and public pages (design overhaul, tasteskill v2)
See `docs/DESIGN.md`. Summary: new composition ("the sentence is the layout"), one live term finder, a four-stage
slider, flat tone fields, motion layer, in-flow cookie bar, new header and footer, utility pages (pricing, login,
demo, legal) restyled, one brand blue, two typefaces (DM Serif Display, Manrope), favicon.
- SEO: per-page metadata, title template, `sitemap.ts`, `robots.ts`, Open Graph image, JSON-LD.

## Not done / left on purpose
- `app/onboarding` untouched (it polls payment status).
- App screens keep their current layout (design pass 2 pending); only tokens, fonts and nav casing changed.
- About 175 inline `style={{}}` remain; they work but should be moved to classes over time.
- One pre-existing lint error remains in `PracticeSession.tsx` (setState inside an effect).
