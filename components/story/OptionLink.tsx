"use client";

import Link from "next/link";
import { useChoices } from "@/lib/story-journey";

/**
 * A story option: a normal link that also remembers which option was taken, so
 * the last step can summarize the reader's design. The choice is recorded on
 * click (a user event), not in an effect, so it happens exactly once per pick.
 */
export function OptionLink({
  href,
  stepId,
  optionIndex,
  className,
  children,
}: {
  href: string;
  stepId: string;
  optionIndex: number;
  className?: string;
  children: React.ReactNode;
}) {
  const { choose } = useChoices();
  return (
    <Link href={href} className={className} onClick={() => choose(stepId, optionIndex)}>
      {children}
    </Link>
  );
}
