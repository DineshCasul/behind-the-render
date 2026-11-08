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
