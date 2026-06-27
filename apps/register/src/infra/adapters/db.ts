import { PrismaClient } from "../database/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

function getDatabaseUrl(): string {
  const url = process.env.NEON_DATABASE_URL;

  if (!url) {
    throw new Error(
      "NEON_DATABASE_URL não definida. Verifique o arquivo .env do serviço register."
    );
  }

  return url;
}

function createPrismaClient(): PrismaClient {
  const pool = new pg.Pool({ connectionString: getDatabaseUrl() });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
