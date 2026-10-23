import { createHash } from 'node:crypto';
import { META_PIXEL_ID, PLAN_VALUES, type MetaPlan } from './metaShared';

// Server-side Meta Conversions API. Never throws: a Meta outage must never make the
// Polar webhook fail (which would trigger retries and delay account activation).

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

export function buildMetaPurchasePayload(input: {
  plan: MetaPlan;
  userId: string;
  email?: string | null;
  metadata: Record<string, unknown>;
  sourceUrl: string;
  now?: number;
}) {
  const md = input.metadata;
  if (md.metaConsent !== '1') return null; // no marketing consent at checkout time
  const eventId = typeof md.metaEventId === 'string' ? md.metaEventId : '';
  if (!eventId) return null;

  const userData: Record<string, unknown> = { external_id: [sha256(input.userId)] };
  if (input.email) userData.em = [sha256(input.email.trim().toLowerCase())];
  if (typeof md.fbp === 'string' && md.fbp) userData.fbp = md.fbp;
  if (typeof md.fbc === 'string' && md.fbc) userData.fbc = md.fbc;
  if (typeof md.ip === 'string' && md.ip) userData.client_ip_address = md.ip;
  if (typeof md.ua === 'string' && md.ua) userData.client_user_agent = md.ua;

  return {
    data: [{
      event_name: 'Purchase',
      event_time: Math.floor((input.now ?? Date.now()) / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: input.sourceUrl,
      user_data: userData,
      custom_data: { currency: 'EUR', value: PLAN_VALUES[input.plan], content_name: input.plan, content_type: 'product' },
    }],
  };
}

export async function sendMetaPurchase(input: {
  plan: MetaPlan;
  userId: string;
  email?: string | null;
  metadata: Record<string, unknown>;
  sourceUrl: string;
}) {
  try {
    const token = process.env.META_CAPI_TOKEN;
    if (!token) return;
    const payload = buildMetaPurchasePayload(input);
    if (!payload) return;
    const version = process.env.META_GRAPH_VERSION || 'v25.0';
    const body: Record<string, unknown> = { ...payload, access_token: token };
    if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;
    const response = await fetch(`https://graph.facebook.com/${version}/${META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.error('[meta capi] request failed', response.status, await response.text().catch(() => ''));
  } catch (error) {
    console.error('[meta capi] error', error);
  }
}
