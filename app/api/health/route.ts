import { db } from '@/lib/db';

export async function GET(req: Request) {
  const expectedToken = process.env.HEALTHCHECK_TOKEN;
  if (expectedToken) {
    const provided = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (provided !== expectedToken) return Response.json({ healthy: false }, { status: 401 });
  }

  try {
    await db.user.count();
    return Response.json({ healthy: true, database: 'ok' }, { status: 200 });
  } catch {
    return Response.json({ healthy: false, database: 'failed' }, { status: 500 });
  }
}
