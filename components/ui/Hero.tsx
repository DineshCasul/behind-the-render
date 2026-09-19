import { AmbientParticles } from "@/components/ui/AmbientParticles";

export function Hero() {
  return (
    <section className="relative flex min-h-[46vh] flex-col items-center justify-center overflow-hidden px-6 text-center sm:min-h-[52vh]">
      <AmbientParticles />
      <p className="relative font-mono text-xs uppercase tracking-[0.3em] text-[var(--state-learning)]">
        A developer laboratory
      </p>
      <h1 className="relative mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-6xl">
        The Rendering Lab
      </h1>
      <p className="relative mt-5 max-w-xl text-balance text-base text-[var(--color-text-muted)] sm:text-lg">
        Explore how the modern web turns a request into pixels.
      </p>
      <p className="relative mt-8 font-mono text-xs text-[var(--color-text-muted)]">
        Click any node below to inspect it. Nothing is locked.
      </p>
    </section>
  );
}
