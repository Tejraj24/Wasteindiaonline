import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Waste",
  description: "A Modern Expression of Heritage",
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
      <body className="antialiased bg-brand-bg text-brand-black font-sans selection:bg-brand-black selection:text-brand-bg">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
