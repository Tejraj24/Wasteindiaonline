import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";
import { BRAND_CONFIG } from "@/lib/config/brand";

const FAVICON_URL = "https://ik.imagekit.io/d8cunijto/fav-icon-waste.png?updatedAt=1793037706361";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wasteluxe.in"),
  title: "WASTE — Contemporary Indian Streetwear",
  description: "Indian contemporary streetwear brand founded in 2024. Distinctive designs, strong silhouettes, and modern Indian culture. Made in India. Built for the world.",
  icons: {
    icon: [
      { url: FAVICON_URL, type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: [FAVICON_URL],
    apple: [
      { url: FAVICON_URL, sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WASTE®",
  url: "https://www.wasteluxe.in",
  logo: "https://res.cloudinary.com/dom7a6zlx/image/upload/v1791873242/waste_yl29iy.jpg",
  email: BRAND_CONFIG.contact.officialBusinessEmail,
  founder: {
    "@type": "Person",
    name: BRAND_CONFIG.founder.name,
  },
  sameAs: [
    BRAND_CONFIG.socials.instagram.url,
    BRAND_CONFIG.socials.facebook.url,
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WASTE®",
  url: "https://www.wasteluxe.in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={FAVICON_URL} type="image/png" />
        <link rel="shortcut icon" href={FAVICON_URL} />
        <link rel="apple-touch-icon" href={FAVICON_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&family=Reenie+Beanie&family=Tenor+Sans&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="antialiased bg-brand-bg text-brand-black font-sans selection:bg-brand-black selection:text-brand-bg">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
