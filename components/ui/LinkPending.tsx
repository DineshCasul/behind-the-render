"use client";

import { useLinkStatus } from "next/link";

/**
 * Put inside a <Link>. While that link's page is being fetched it shows "loading…" next to the link text, so a
 * tap on a slow connection never looks like nothing happened. (Next only switches pages once the next page's
 * data has arrived, which on a cold phone connection can take seconds.) role="status" lets screen readers hear it.
 */
export function LinkPending() {
  const { pending } = useLinkStatus();
  return pending ? (
    <span role="status" className="ml-2 text-sm text-[var(--state-learning)]">
      loading…
    </span>
  ) : null;
}
