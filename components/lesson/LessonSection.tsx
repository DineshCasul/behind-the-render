import type { LessonSectionId } from "@/lib/types";

/**
 * `id` is the anchor the map panel's topic links jump to
 * (`/learn/ssr#how-it-works`); `scroll-mt-16` keeps the heading clear of the
 * sticky lesson bar after the jump.
 */
export function LessonSection({
  id,
  heading,
  children,
}: {
  id: LessonSectionId;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-16">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--state-learning)]">
        {heading}
      </h2>
      <div className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-primary)]">
        {children}
      </div>
    </section>
  );
}
