"use client";

import { useRouter } from "next/navigation";

/**
 * "Surprise me": opens a random road. The list of links comes in as a prop
 * from the Server Component, so this small client island does not pull the
 * journey data into the browser bundle.
 */
export function SurpriseButton({ hrefs }: { hrefs: string[] }) {
  const router = useRouter();
  return (
    <button type="button" className="btn-ghost btn-ghost-lg" onClick={() => router.push(hrefs[Math.floor(Math.random() * hrefs.length)])}>
      <span aria-hidden>⚄</span> Surprise me
    </button>
  );
}
