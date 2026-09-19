import { AmbientParticles } from "@/components/ui/AmbientParticles";
import { HudCorners } from "@/components/ui/HudCorners";
import { TerminalLine } from "@/components/ui/TerminalLine";

export function Hero() {
  return (
    <section className="relative mx-2 flex min-h-[50vh] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] px-6 text-center sm:mx-6 sm:min-h-[56vh]">
      <AmbientParticles />
      <HudCorners />
      <p className="relative font-mono text-xs uppercase tracking-[0.35em] text-[var(--state-learning)]">
        01 — A developer laboratory
      </p>
      <h1 className="text-glow relative mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-7xl">
        Critical Path
      </h1>
      <p className="relative mt-5 max-w-xl text-balance text-base text-[var(--color-text-muted)] sm:text-lg">
        Explore how the modern web turns a request into pixels.
      </p>
      <div className="relative mt-9">
        <TerminalLine>tracing request → paint, one concept at a time_</TerminalLine>
      </div>
    </section>
  );
}
