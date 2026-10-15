import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "WASTE — Contemporary Indian Streetwear",
  description: "Indian contemporary streetwear brand founded in 2024. Distinctive designs, strong silhouettes, and modern Indian culture. Made in India. Built for the world.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&family=Reenie+Beanie&family=Tenor+Sans&display=swap"
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
