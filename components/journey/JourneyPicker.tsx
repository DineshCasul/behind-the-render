import Link from "next/link";
import { GroupedRoads } from "@/components/home/Grouped";

/**
 * "Whose click are we following?" A Server Component: just links. Deliberately
 * a list with hairlines instead of a grid of cards, so it reads like a menu in a
 * game rather than a pricing page.
 */
export function JourneyPicker() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
      <Link href="/" className="btn-ghost self-start !px-3.5 !py-1.5">
        <span aria-hidden>←</span> Home
      </Link>

      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--state-learning)]">Choose a road</p>
      <h1
        className="mt-4 text-balance font-serif text-4xl text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl"
        style={{ textShadow: "0 0 28px color-mix(in srgb, var(--state-learning) 55%, transparent)" }}
      >
        Whose click are we following?
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed lg:text-lg text-[var(--color-text-muted)]">
        Same web, different roads. Every claim along the way comes with a link to where it was said.
      </p>

      <div className="mt-10">
        <GroupedRoads />
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
        More apps get a road only when there is a first-party source to quote: their own docs, their own code, or a case
        study Google published about them.
      </p>
      <p className="mt-4 text-sm">
        <Link href="/trick" className="text-[var(--state-learning)] underline underline-offset-4">
          Or browse the tricks on their own →
        </Link>
      </p>
    </main>
  );
}
