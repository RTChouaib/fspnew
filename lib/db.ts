import { PrismaClient } from '@prisma/client';
import { assertDatabaseEnv } from './env';

assertDatabaseEnv();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
