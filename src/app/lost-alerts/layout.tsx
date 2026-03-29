import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lost alerts — Spotted",
  description: "See what classmates are looking for on campus.",
};

export default function LostAlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
