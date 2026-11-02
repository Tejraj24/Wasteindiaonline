import { AdminGate } from "@/components/admin/AdminGate";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Command Center | WASTE.",
  description: "Enterprise Ecommerce Management for WASTE.",
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      <AdminLayout>{children}</AdminLayout>
    </AdminGate>
  );
}
