import Link from "next/link";
import { SurpriseButton } from "@/components/home/SurpriseButton";
import { AmbientParticles } from "@/components/ui/AmbientParticles";
import { HudCorners } from "@/components/ui/HudCorners";
import { TerminalLine } from "@/components/ui/TerminalLine";
import { TRICK_GROUPS } from "@/data/categories";
import { journeys } from "@/data/journey";
import { hueStyle } from "@/data/road-hues";
import { tricks } from "@/data/tricks";

/**
 * The top of the home page. It does not list the sites, because that list keeps
 * growing. It asks what you are curious about and answers with the (few, fixed)
 * themes the tricks are filed under, plus a random pick. The terminal line cycles through
 * one question per trick (`curious` in data/tricks.ts). The counts are read from
 * the data, so they stay right as content is added. A Server Component: the chips
 * are plain links, only the random pick needs JavaScript.
 */
export function HomeHero() {
  const sites = journeys.filter((j) => j.kind !== "start").length; // "start" is the general road, not a site
  return (
    <section className="relative mx-2 flex min-h-[60svh] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] px-6 py-16 text-center sm:mx-6">
      <AmbientParticles />
      <HudCorners />
      <p className="reveal-fade relative font-mono text-xs uppercase tracking-[0.35em] text-[var(--state-learning)]" style={{ ["--delay" as string]: "0.1s" }}>
        How real sites actually work
      </p>
      <h1 className="text-glow reveal-fade relative mt-5 max-w-3xl text-6xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-8xl" style={{ ["--delay" as string]: "0.25s" }}>
        Web Lore
      </h1>
      <p className="reveal-fade relative mt-5 max-w-xl text-balance text-lg text-[var(--color-text-primary)] sm:text-xl" style={{ ["--delay" as string]: "0.45s" }}>
        Every big site hides a few clever tricks. Here they are, in the companies&apos; own words.
      </p>
      <div className="relative mt-6">
        <TerminalLine lines={tricks.map((t) => t.curious)} />
      </div>

      <p className="relative mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">What are you curious about?</p>
      <ul className="relative mt-4 flex max-w-3xl flex-wrap justify-center gap-2.5">
        {TRICK_GROUPS.map((g, i) => (
          <li key={g.id} className="row-rise" style={{ ...hueStyle(g.hue), ["--i" as string]: i + 4 }}>
            <Link href={`/trick#${g.id}`} className="site-chip">
              <span aria-hidden className="site-chip-dot" />
              {g.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
        <SurpriseButton hrefs={journeys.map((j) => `/journey/${j.id}`)} />
        <Link href="/journey" className="btn-ghost btn-ghost-lg">
          All {sites} sites
        </Link>
        <Link href="/trick" className="btn-ghost btn-ghost-lg">
          All {tricks.length} tricks
        </Link>
      </div>
    </section>
  );
}
