import test from 'node:test';
import assert from 'node:assert/strict';

// canAccess lives next to the database client, so import it lazily with a dummy URL.
// If the Prisma client has not been generated in this environment, the test is skipped.
process.env.DATABASE_URL ??= 'postgresql://user:pass@localhost:5432/test';

async function load() {
  try {
    return (await import('./progress')).canAccess;
  } catch {
    return null;
  }
}

test('demo content is always accessible', async (t) => {
  const canAccess = await load();
  if (!canAccess) return t.skip('Prisma client not generated');
  assert.equal(canAccess(null, 'demo'), true);
});

test('full access requires an active or trial subscription', async (t) => {
  const canAccess = await load();
  if (!canAccess) return t.skip('Prisma client not generated');
  assert.equal(canAccess(null, 'full'), false);
  assert.equal(canAccess({ status: 'active' }, 'full'), true);
  assert.equal(canAccess({ status: 'trial' }, 'full'), true);
  assert.equal(canAccess({ status: 'expired' }, 'full'), false);
  assert.equal(canAccess({ status: 'free' }, 'full'), false);
  assert.equal(canAccess({ status: null }, 'full'), false);
});
