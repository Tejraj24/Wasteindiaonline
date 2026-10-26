import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — WASTE",
  description: "Sign in to your WASTE account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
