/**
 * Official Category Configuration for WASTE
 * Single source of truth for SEO landing pages, metadata, and product scope.
 */

export interface CategoryConfig {
  slug: string;
  name: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  productSlugs: string[];
}

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  "t-shirts": {
    slug: "t-shirts",
    name: "T-Shirts & Tops",
    title: "Oversized Graphic T-Shirts | WASTE",
    h1: "T-Shirts & Tops",
    metaDescription:
      "Discover oversized graphic T-shirts and distinctive tops from WASTE. Explore expressive artwork, relaxed silhouettes and contemporary Indian streetwear.",
    intro:
      "Explore the WASTE T-Shirts & Tops collection, featuring graphic-led designs and relaxed silhouettes. Discover statement pieces made for individual expression and contemporary streetwear styling.",
    productSlugs: [
      "art-of-rebellion-oversized-t-shirt",
      "waste-crimson-bloom-oversized-tee",
      "shark-tale-black-unisex-oversized-t-shirt",
      "timeless-chaos-studio-unisex-oversized-tshirt",
      "leopard-noir-waffle-unisex-oversized-waffle",
    ],
  },
  "outerwear": {
    slug: "outerwear",
    name: "Outerwear & Layers",
    title: "Streetwear Outerwear & Layers | WASTE",
    h1: "Outerwear & Layers",
    metaDescription:
      "Explore statement outerwear and layering pieces from WASTE, including distinctive jacket and sweatshirt designs for contemporary streetwear looks.",
    intro:
      "Discover the WASTE Outerwear & Layers collection, bringing together statement jacket and sweatshirt styles for contemporary streetwear looks.",
    productSlugs: [
      "leopard-fur-jacket-waste-originals",
      "sunflower-hour-art-unisex-oversized-sweatshirt",
    ],
  },
};

export const VALID_CATEGORY_SLUGS = Object.keys(CATEGORY_CONFIGS) as Array<
  keyof typeof CATEGORY_CONFIGS
>;

export function getCategoryByProductSlug(productSlug: string): CategoryConfig | null {
  for (const config of Object.values(CATEGORY_CONFIGS)) {
    if (config.productSlugs.includes(productSlug)) {
      return config;
    }
  }
  return null;
}
