# Pre-launch implementation notes

Implemented P0/P1 engineering work without changing Paddle/payment logic.

## P0
- Persistent daily StudySession with resume state.
- Patientengespräch server-side subscription checks.
- Existing in-progress case sessions are resumed instead of duplicated.
- AI evaluation weaknesses are mapped back to existing terminology and queued as Mistake records.
- Simulation stores the exact review term IDs on the completed case session.
- Double-submit protection for simulation evaluation.
- Account deletion with cascading user data deletion; active/trial subscriptions must finish before deletion.
- Production health endpoint no longer exposes environment-variable names/status publicly; optionally protect it with HEALTHCHECK_TOKEN.

## P1
- Resume in-progress Patientengespräch from dashboard/case library.
- Actionable review terms on simulation results.
- Key analytics events for study/simulation.
- Mobile-friendly simulation layout.
- Existing 301-term dataset validated: unique IDs and curriculum category coverage.

## Database
Run migrations before deployment:

```bash
npx prisma migrate deploy
npx prisma generate
```

The new migrations are:
- `20260927000000_add_study_sessions`
- `20260927001000_add_simulation_review_terms`

## Verification
The source was syntax-checked as far as possible in this environment, but a full `npm run lint` / `npm run build` could not be completed because the available `node_modules` install is incomplete and package installation timed out.

Before deploying:

```bash
npm install
npm run lint
npm run build
```

Then test the real Patientengespräch flow against the production AI configuration.

Paddle was intentionally not modified.

## Latest UX fix
- Production builds now run `prisma db seed` so the 10 synthetic Patientengespräch cases are present automatically.
- Study steps now show green completion checks.
- Completing a study activity offers a direct button to the next activity.
- New-term study uses a real multi-term queue with automatic next-term progression.
- Patientengespräch results can continue directly to the Check step.
