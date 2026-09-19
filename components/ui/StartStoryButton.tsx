import Link from "next/link";

/** The primary call to action on the home page. Server Component: just a link. */
export function StartStoryButton() {
  return (
    <Link
      href="/story/the-drop"
      className="cta-story inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-widest"
    >
      Start the story <span aria-hidden>→</span>
    </Link>
  );
}
