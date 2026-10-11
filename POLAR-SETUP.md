# Polar billing migration notes

This version keeps the existing user IDs, authentication, learning data, and subscription table. It adds Polar IDs with an additive Prisma migration; it does not delete legacy Paddle columns or user data.

## Vercel environment variables

Set these in **Production** (and Preview only if Preview uses its own test configuration):

- `POLAR_ACCESS_TOKEN`: Polar personal access token with permission to create checkouts and manage subscriptions (`polar_oat_...`).
- `POLAR_WEBHOOK_SECRET`: signing secret from the Polar webhook endpoint (`polar_whs_...`).
- `POLAR_PRODUCT_WEEKLY`: Polar product UUID for the weekly plan.
- `POLAR_PRODUCT_MONTHLY`: Polar product UUID for the monthly plan.
- `POLAR_PRODUCT_QUARTERLY`: Polar product UUID for the 3-month plan.
- `NEXT_PUBLIC_APP_URL`: `https://fsp.by-rtc.com` in Production.

Product IDs are not checkout-link IDs or price IDs. Copy each product's UUID from Polar's product/catalog details. Check that each product's recurring interval and price match the plan text on the website.

## Webhook configuration

Create a Polar webhook endpoint at:

`https://fsp.by-rtc.com/api/webhooks/polar`

Use the raw JSON format and subscribe to at least:

- `subscription.active`
- `subscription.updated`
- `subscription.uncanceled`
- `subscription.canceled`
- `subscription.revoked`

Copy the webhook signing secret into `POLAR_WEBHOOK_SECRET`. The endpoint verifies the signature and timestamp before processing events. Never paste the secret into client-side variables or commit it to Git.

## Safe rollout

1. Add the environment variables and verify the product IDs.
2. Deploy the code so the additive migration runs. Keep the prior deployment available for rollback.
3. Configure the Polar webhook and test a sandbox payment. Confirm the webhook delivery is successful and the right user becomes active.
4. Test a failed/abandoned checkout, repeat checkout prevention, cancellation, and the post-checkout return.
5. Only then switch to live products/tokens and announce payments.

The success page never grants access by itself; access is set by the verified webhook. If checkout succeeds but access remains inactive, inspect Polar's webhook delivery and Vercel function logs before trying a second payment.

## Notes

- The original Paddle-specific dependency remains in `package.json`/lockfile for now to avoid an unnecessary dependency-lockfile rewrite in an environment without registry access. The app no longer imports the Paddle SDK or exposes the old Paddle webhook route. It can be removed safely in a later cleanup with a normal dependency install.
- This environment could not reach the npm registry during this migration, so a full dependency-installed Next.js build could not be run here. Run `npm ci` and `npm run build` in your normal development environment before treating this as production-ready.
