/**
 * One slow-drifting soft light source behind the whole page, the single
 * piece of "the lab has ambient life to it" motion. The drift is a CSS
 * keyframe animation (`.ambient-drift` in globals.css) on `transform` and
 * `opacity`, both compositor-only properties, so it costs no JavaScript and
 * no style work per frame, and this is a plain Server Component. It used to be
 * a Framer Motion loop, which re-ran style calculation about 60 times a second
 * on every page, even when nothing else was happening (see
 * learning-notes/06-animation-and-reduced-motion.md).
 */
export function AmbientGlow() {
  return (
    <>
    <div
      className="ambient-drift absolute -left-1/4 -top-1/4 h-[70vh] w-[70vh] rounded-full"
      style={{
        background: "radial-gradient(circle, color-mix(in srgb, var(--state-learning) 14%, transparent), transparent 70%)",
        filter: "blur(40px)",
      }}
    />
    <div
      className="ambient-drift-b absolute -bottom-1/4 -right-1/4 h-[60vh] w-[60vh] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(255, 93, 158, 0.14), transparent 70%)", filter: "blur(50px)" }}
    />
    </>
  );
}
