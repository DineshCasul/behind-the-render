import type { LessonSectionId } from "@/lib/types";

/**
 * `id` is the anchor the map panel's topic links jump to
 * (`/learn/ssr#how-it-works`); `scroll-mt-16` keeps the heading clear of the
 * sticky lesson bar after the jump.
 *
 * `collapsed` turns the section into a native `<details>` row: just the
 * heading until you open it. A lesson is a dozen sections, and stacking all of
 * them open makes the page a blog post. `<details>` needs no JavaScript to
 * toggle, is keyboard and screen-reader accessible by default, and the closed
 * content is still in the HTML (search engines and find-in-page see it). The
 * one thing it doesn't do is open itself when a link points inside it, which
 * is what <OpenOnHash> and the lesson nav handle.
 */
export function LessonSection({
  id,
  heading,
  children,
  collapsed = false,
}: {
  id: LessonSectionId;
  heading: string;
  children: React.ReactNode;
  collapsed?: boolean;
}) {
  if (collapsed) {
    return (
      <details id={id} className="group/fold mt-3 scroll-mt-16 border-t border-[var(--color-border)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--state-learning)] [&::-webkit-details-marker]:hidden">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--state-learning)]">{heading}</h2>
          <span aria-hidden className="font-mono text-sm text-[var(--color-text-muted)] transition-transform group-open/fold:rotate-90">
            ›
          </span>
        </summary>
        <div className="pb-6 text-[15px] leading-relaxed text-[var(--color-text-primary)]">{children}</div>
      </details>
    );
  }

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
