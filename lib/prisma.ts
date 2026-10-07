import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not defined. Please add it to your environment variables."
    );
  }

  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

/**
 * Lazy Prisma client singleton proxy.
 *
 * Prevents premature initialization or DATABASE_URL access at module import /
 * build time during Next.js page data collection on platforms like Vercel.
 *
 * Instantiates the client on the first actual database query at runtime.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrismaClient();
    const value = client[prop];
    if (typeof value === "function") {
      return (value as Function).bind(client);
    }
    return value;
  },
});

export default prisma;
