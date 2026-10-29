# Meta Pixel + Conversions API

Pixel ID: 1866116664750968 (public; override with NEXT_PUBLIC_META_PIXEL_ID).

Vercel environment variables
- `META_CAPI_TOKEN`: Events Manager → your pixel → Settings → Conversions API → Generate access token. Server-only secret.
- `META_TEST_EVENT_CODE`: only while testing (Events Manager → Test events). Remove afterwards.
- `META_GRAPH_VERSION`: optional, defaults to v25.0.

How it works
- Nothing loads before the visitor accepts the cookie banner (cookie `fsp_consent`). Footer link "Cookie-Einstellungen" reopens it.
- Browser: PageView (every page), InitiateCheckout (pay button), Purchase (/checkout/success).
- Server: Purchase from the Polar webhook on `subscription.active`, only if consent was given at checkout.
- Both Purchase events share one event ID (created in /api/checkout) so Meta deduplicates them.
- Value sent = plan price in EUR from lib/metaShared.ts. Update it if prices change.
- Do NOT add Meta's `<noscript>` image tag: it tracks without consent.
