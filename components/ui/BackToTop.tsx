/**
 * A small "back to top" link, fixed to the corner of long pages. It fades in once you have scrolled a
 * good way down (CSS only, see `.to-top` in app/globals.css) and is always visible where the browser
 * has no scroll timelines. The `#` link scrolls to the top of the page.
 */
export function BackToTop() {
  return (
    <a href="#" className="btn to-top">
      <span aria-hidden>↑</span> top
    </a>
  );
}
