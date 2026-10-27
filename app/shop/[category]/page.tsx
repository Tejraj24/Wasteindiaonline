import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_CONFIGS, VALID_CATEGORY_SLUGS } from "@/lib/config/categories";
import { getCategoryProducts } from "@/lib/services/product.service";
import { CategoryCatalogClient } from "./CategoryCatalogClient";

export const revalidate = 0; // Dynamic server rendering with live product updates

export function generateStaticParams() {
  return VALID_CATEGORY_SLUGS.map((slug) => ({
    category: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const config = CATEGORY_CONFIGS[params.category];
  if (!config) return {};

  const url = `https://www.wasteluxe.in/shop/${config.slug}`;

  return {
    title: config.title,
    description: config.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: config.title,
      description: config.metaDescription,
      url,
      siteName: "WASTE®",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.metaDescription,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const config = CATEGORY_CONFIGS[params.category];
  if (!config) {
    notFound();
  }

  const products = await getCategoryProducts(params.category);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.wasteluxe.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://www.wasteluxe.in/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: config.name,
        item: `https://www.wasteluxe.in/shop/${config.slug}`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.title,
    description: config.metaDescription,
    url: `https://www.wasteluxe.in/shop/${config.slug}`,
    isPartOf: {
      "@type": "WebSite",
      "name": "WASTE®",
      "url": "https://www.wasteluxe.in",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c"),
        }}
      />
      <CategoryCatalogClient category={config} products={products} />
    </>
  );
}
