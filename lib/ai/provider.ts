// AI provider abstraction. The rest of the app calls patient.ts / evaluator.ts,
// never this file directly and never the DeepSeek SDK/fetch call directly —
// so swapping providers later (or adding a fallback provider) touches one file.

import { requireEnv } from '@/lib/env';

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  /** When set, asks the model to return JSON matching this shape description
   *  (DeepSeek supports OpenAI-style `response_format: json_object`, so the
   *  schema itself must also be spelled out in the system prompt — this flag
   *  only turns on strict JSON-mode parsing, it doesn't enforce the schema). */
  jsonMode?: boolean;
}

export class AIProviderError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'AIProviderError';
  }
}

/**
 * Single low-level call to the configured AI provider. Never call this from
 * a component or route handler directly — go through patient.ts/evaluator.ts,
 * which own the actual prompts and response validation.
 */
export async function complete(options: CompletionOptions): Promise<string> {
  const apiKey = requireEnv('DEEPSEEK_API_KEY');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  let res: Response;
  try {
    res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1000,
        ...(options.jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: controller.signal,
    });
  } catch (err) {
    throw new AIProviderError('AI provider request failed or timed out', err);
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    // Never forward the raw provider error body to the client — it can leak
    // account/billing details. Log it server-side, throw a generic error.
    const body = await res.text().catch(() => '');
    console.error(`[ai] DeepSeek request failed: ${res.status} ${body}`);
    throw new AIProviderError(`AI provider returned ${res.status}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new AIProviderError('AI provider returned an unexpected response shape');
  }
  return content;
}
