"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderUserSection } from "@/components/HeaderUserSection";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-spot-sky/50 text-spot-navy ring-1 ring-spot-blue/25"
          : "text-spot-blue hover:bg-spot-sky/30 hover:text-spot-navy"
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-spot-sky/40 bg-white/85 backdrop-blur-md shadow-sm shadow-spot-navy/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-spot-navy"
          >
            Spotted
          </Link>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Main">
            <NavLink href="/">Found items</NavLink>
            <NavLink href="/lost-alerts">Lost alerts</NavLink>
          </nav>
        </div>
        <HeaderUserSection />
      </div>
    </header>
  );
}
