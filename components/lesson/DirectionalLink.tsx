"use client";

import Link from "next/link";
import { setNavDirection, type NavDirection } from "@/lib/nav-direction";

/**
 * A normal Next.js link that also tells the page transition which way to
 * slide. Modified clicks (open in new tab, etc.) are ignored so a stale
 * direction can't leak into some later, unrelated navigation.
 */
export function DirectionalLink({
  href,
  direction,
  className,
  children,
}: {
  href: string;
  direction: NavDirection;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        setNavDirection(direction);
      }}
    >
      {children}
    </Link>
  );
}
