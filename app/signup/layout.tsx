import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — WASTE",
  description: "Create an account for a considered way to shop at WASTE.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
