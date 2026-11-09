import { hash, KINDS, SHAPES } from "@/components/ui/MarginShapes";

/**
 * A small outline shape at the right end of a section heading. It is the phone and tablet version of the
 * margin shapes (those only fit from 1280px wide): it draws itself and turns as the heading scrolls into
 * view (see `.section-mark` in app/globals.css). Hidden where the margin shapes show. Put it inside a
 * `.section-title`, which is positioned and leaves room for it.
 */
export function SectionMark({ seed }: { seed: string }) {
  const paths = SHAPES[KINDS[hash(seed) % KINDS.length]];
  return (
    <span className="section-mark" aria-hidden>
      <svg viewBox="0 0 100 100" focusable="false">
        {paths.map((d) => (
          <path key={d} d={d} pathLength={1} />
        ))}
      </svg>
    </span>
  );
}
