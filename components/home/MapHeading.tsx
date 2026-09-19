import Link from "next/link";
import { questionBank } from "@/data/question-bank";

/** Names the map as the second way in, so "Start the story" reads as the main one. */
export function MapHeading({ className = "", withQuestionsLink = false }: { className?: string; withQuestionsLink?: boolean }) {
  return (
    <div className={className}>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--state-learning)]">
        Or explore every concept
      </p>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">Tap any node. There is no required order.</p>
      {withQuestionsLink && (
        <p className="mt-3">
          <Link href="/questions" className="btn-ghost">
            Take the {questionBank.length}-question challenge
          </Link>
        </p>
      )}
    </div>
  );
}
