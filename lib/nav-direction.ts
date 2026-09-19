export type NavDirection = "forward" | "back";

/**
 * A one-slot mailbox between a clicked link and the page-transition
 * template that mounts on the next route. The link records where the user
 * is heading ("forward" to something that builds on this page, "back" to a
 * prerequisite) just before navigating; the template reads it when the new
 * page mounts and slides in from the matching side, then clears it.
 * Module state is fine here: it only ever lives in the browser, for the
 * few milliseconds between a click and the next mount.
 */
let pending: NavDirection | null = null;

export const setNavDirection = (direction: NavDirection) => {
  pending = direction;
};
export const peekNavDirection = () => pending;
export const clearNavDirection = () => {
  pending = null;
};
