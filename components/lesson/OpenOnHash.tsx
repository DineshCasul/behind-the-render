"use client";

import { useEffect } from "react";

/**
 * Opens the collapsed lesson section a URL hash points into. Links such as
 * `/learn/ssr#how-it-works` (from the map panel) or `...#tradeoffs` (a heading
 * inside a collapsed section) would otherwise land on a closed `<details>` and
 * show nothing. `closest("details")` also covers targets nested inside a fold.
 *
 * It renders nothing: it only exists to run this effect, which is why it is the
 * one tiny Client Component on an otherwise static page.
 */
export function OpenOnHash() {
  useEffect(() => {
    const reveal = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      const fold = target?.closest("details");
      if (!target || !fold || fold.open) return;
      fold.open = true;
      target.scrollIntoView();
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  return null;
}
