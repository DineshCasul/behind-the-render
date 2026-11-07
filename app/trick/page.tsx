import type { Metadata } from "next";
import Link from "next/link";
import { GroupedTricks } from "@/components/home/Grouped";

export const metadata: Metadata = {
  title: "The tricks | Web Lore",
  description: "The named ideas behind how real websites work, each with its sources.",
};

export default function TrickIndexPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-16 lg:px-10">
      <Link href="/" className="btn-ghost self-start !px-3.5 !py-1.5">
        <span aria-hidden>←</span> Home
      </Link>

      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--state-learning)]">The tricks</p>
      <h1
        className="mt-4 text-balance font-serif text-4xl text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl"
        style={{ textShadow: "0 0 28px color-mix(in srgb, var(--state-learning) 55%, transparent)" }}
      >
        What the best sites actually do
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed lg:text-lg text-[var(--color-text-muted)]">
        One idea each, short. Every claim comes from the company&apos;s own words, with a link.
      </p>

      <div className="mt-10">
        <GroupedTricks />
      </div>
    </main>
  );
}
