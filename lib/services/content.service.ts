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
}

export interface HomepageContentConfig {
  heroSlides: HeroSlideContent[];
  featuredOverrides: Record<string, { image1?: string; image2?: string }>;
  carouselImages: CarouselSlideContent[];
  updatedAt?: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlideContent[] = [
  {
    id: 1,
    title: "Luxury essentials",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    mobileImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    title: "Quiet statement",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
    mobileImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 3,
    title: "Refined curation",
    image: "https://res.cloudinary.com/dom7a6zlx/image/upload/w_1600,h_900,c_fill,q_80/v1790917475/WhatsApp_Image_2026-10-01_at_11.16.34_PM_kp2k1z.jpg",
    mobileImage: "https://res.cloudinary.com/dom7a6zlx/image/upload/w_1600,h_900,c_fill,q_80/v1790917475/WhatsApp_Image_2026-10-01_at_11.16.34_PM_kp2k1z.jpg",
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
      };
    }

    const row = rows[0];

    const heroSlides = Array.isArray(row.heroSlides) && row.heroSlides.length > 0
      ? row.heroSlides
      : DEFAULT_HERO_SLIDES;

    const featuredOverrides = row.featuredOverrides && typeof row.featuredOverrides === "object"
      ? row.featuredOverrides
      : {};

    const carouselImages = Array.isArray(row.carouselImages) && row.carouselImages.length > 0
      ? row.carouselImages
      : DEFAULT_CAROUSEL_ITEMS;

    return {
      heroSlides,
      featuredOverrides,
      carouselImages,
      updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
    };
  } catch (error) {
    console.error("[getHomepageContent] Error retrieving site content, using defaults:", error);
    return {
      heroSlides: DEFAULT_HERO_SLIDES,
      featuredOverrides: {},
      carouselImages: DEFAULT_CAROUSEL_ITEMS,
    };
  }
}

export async function updateHomepageContent(
  data: Partial<HomepageContentConfig>
): Promise<HomepageContentConfig> {
  const current = await getHomepageContent();

  const heroSlides = data.heroSlides ?? current.heroSlides;
  const featuredOverrides = data.featuredOverrides ?? current.featuredOverrides;
  const carouselImages = data.carouselImages ?? current.carouselImages;

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
    updatedAt: new Date().toISOString(),
  };
}
