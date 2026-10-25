import { prisma } from "@/lib/prisma";

export interface HeroSlideContent {
  id: number;
  title: string;
  image: string;
  mobileImage?: string;
}

export interface FeaturedImageOverride {
  productId: string;
  productName?: string;
  image1?: string;
  image2?: string;
}

export interface CarouselSlideContent {
  id: number;
  title: string;
  image: string;
  mobileImage?: string;
  isCustom?: boolean;
}

export interface HomepageContentConfig {
  heroSlides: HeroSlideContent[];
  featuredOverrides: Record<string, { image1?: string; image2?: string }>;
  carouselImages: CarouselSlideContent[];
  carouselProductIds?: string[];
  updatedAt?: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlideContent[] = [
  {
    id: 1,
    title: "Refined curation",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797220/Picsart_26-10-12_14-49-47-646_ic3wwd.png",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791933532/Waste_Black_Hoodie2_fvgpja.png",
  },
  {
    id: 2,
    title: "Quiet statement",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797197/file_000000005ed48208abf35f02392a64b3.jpg_ibwmtc.jpg",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791881073/file_0000000073748211bf37ba309647258e.jpg_ajebtr.jpg",
  },
  {
    id: 3,
    title: "Luxury essentials",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791797163/Picsart_26-10-12_14-31-46-544_q6xzik.png",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791911772/White_Art_of_Her2_jgatn3.png",
  },
];

export const DEFAULT_CAROUSEL_ITEMS: CarouselSlideContent[] = [
  {
    id: 1,
    title: "Archive 01",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924253/WhatsApp_Image_TOP_toocro.jpg",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924253/WhatsApp_Image_TOP_toocro.jpg",
  },
  {
    id: 2,
    title: "Archive 02",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924402/WhatsApp_Image_2026-10-01_at_12.17.13_PM_ihlf30.jpg",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924402/WhatsApp_Image_2026-10-01_at_12.17.13_PM_ihlf30.jpg",
  },
  {
    id: 3,
    title: "Archive 03",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924498/WhatsApp_Image_2026-10-01_at_11.16.47_PM_ex9pkk.jpg",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924498/WhatsApp_Image_2026-10-01_at_11.16.47_PM_ex9pkk.jpg",
  },
  {
    id: 4,
    title: "Archive 04",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924568/WhatsApp_Image_2026-10-01_at_11.16.42_PM_q23odi.jpg",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924568/WhatsApp_Image_2026-10-01_at_11.16.42_PM_q23odi.jpg",
  },
  {
    id: 5,
    title: "Archive 05",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924473/WhatsApp_Image_2026-10-01_at_11.18.01_PM_wlstuq.jpg",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1790924473/WhatsApp_Image_2026-10-01_at_11.18.01_PM_wlstuq.jpg",
  },
];

export async function getHomepageContent(): Promise<HomepageContentConfig> {
  try {
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT "id", "heroSlides", "featuredOverrides", "carouselImages", "updatedAt" FROM "SiteContent" WHERE "id" = 'homepage' LIMIT 1;`
    );

    if (!rows || rows.length === 0) {
      return {
        heroSlides: DEFAULT_HERO_SLIDES,
        featuredOverrides: {},
        carouselImages: DEFAULT_CAROUSEL_ITEMS,
        carouselProductIds: [],
      };
    }

    const row = rows[0];

    const heroSlides = Array.isArray(row.heroSlides) && row.heroSlides.length > 0
      ? row.heroSlides
      : DEFAULT_HERO_SLIDES;

    const rawOverrides = row.featuredOverrides && typeof row.featuredOverrides === "object"
      ? row.featuredOverrides
      : {};

    const carouselProductIds = Array.isArray(rawOverrides._carouselProductIds)
      ? rawOverrides._carouselProductIds
      : [];

    const featuredOverrides: Record<string, { image1?: string; image2?: string }> = {};
    for (const [k, v] of Object.entries(rawOverrides)) {
      if (k !== "_carouselProductIds" && v && typeof v === "object") {
        featuredOverrides[k] = v as { image1?: string; image2?: string };
      }
    }

    const carouselImages = Array.isArray(row.carouselImages) && row.carouselImages.length > 0
      ? row.carouselImages
      : DEFAULT_CAROUSEL_ITEMS;

    return {
      heroSlides,
      featuredOverrides,
      carouselImages,
      carouselProductIds,
      updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
    };
  } catch (error) {
    console.error("[getHomepageContent] Error retrieving site content, using defaults:", error);
    return {
      heroSlides: DEFAULT_HERO_SLIDES,
      featuredOverrides: {},
      carouselImages: DEFAULT_CAROUSEL_ITEMS,
      carouselProductIds: [],
    };
  }
}

export async function updateHomepageContent(
  data: Partial<HomepageContentConfig>
): Promise<HomepageContentConfig> {
  const current = await getHomepageContent();

  const heroSlides = data.heroSlides ?? current.heroSlides;
  const featuredOverrides = { ...(data.featuredOverrides ?? current.featuredOverrides) };
  const carouselImages = data.carouselImages ?? current.carouselImages;
  const carouselProductIds = data.carouselProductIds ?? current.carouselProductIds;

  if (Array.isArray(carouselProductIds)) {
    (featuredOverrides as any)._carouselProductIds = carouselProductIds;
  }

  await prisma.$executeRawUnsafe(
    `INSERT INTO "SiteContent" ("id", "heroSlides", "featuredOverrides", "carouselImages", "updatedAt")
     VALUES ('homepage', $1::jsonb, $2::jsonb, $3::jsonb, CURRENT_TIMESTAMP)
     ON CONFLICT ("id")
     DO UPDATE SET
       "heroSlides" = EXCLUDED."heroSlides",
       "featuredOverrides" = EXCLUDED."featuredOverrides",
       "carouselImages" = EXCLUDED."carouselImages",
       "updatedAt" = CURRENT_TIMESTAMP;`,
    JSON.stringify(heroSlides),
    JSON.stringify(featuredOverrides),
    JSON.stringify(carouselImages)
  );

  return {
    heroSlides,
    featuredOverrides,
    carouselImages,
    carouselProductIds,
    updatedAt: new Date().toISOString(),
  };
}
