import { prisma } from "../lib/prisma";

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SiteContent" (
      "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'homepage',
      "heroSlides" JSONB,
      "featuredOverrides" JSONB,
      "carouselImages" JSONB,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("SiteContent table verified / created in PostgreSQL database.");
}

main()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
