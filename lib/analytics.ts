import { db } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function trackEvent(name: string, userId?: string | null, props?: Record<string, unknown>) {
  try {
    await db.analyticsEvent.create({ data: { name, userId: userId ?? undefined, props: props as Prisma.InputJsonValue | undefined } });
  } catch (error) {
    console.error('[analytics] failed', error);
  }
}
