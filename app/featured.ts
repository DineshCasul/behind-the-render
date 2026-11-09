import { tricks } from "@/data/tricks";

/**
 * The trick whose big number is shown on the home page today. It is picked by the day, so it is the
 * same for everyone on a given day and changes at midnight UTC. Kept out of the page component because
 * reading the clock is not something a component should do while rendering.
 */
export function featuredTrick() {
  const withStat = tricks.filter((t) => t.stat);
  return withStat[Math.floor(Date.now() / 86_400_000) % withStat.length];
}

/**
 * Every trick that has a big number, in the small shape the home page's random pick needs, plus the index of
 * today's trick (the server's choice, shown with JavaScript off). Only plain strings, so it can cross to the browser.
 */
export function featuredPool() {
  const items = tricks.filter((t) => t.stat).map((t) => ({ slug: t.slug, title: t.title, hook: t.hook, stat: t.stat!.value }));
  const today = featuredTrick().slug;
  return { items, initial: Math.max(0, items.findIndex((i) => i.slug === today)) };
}
