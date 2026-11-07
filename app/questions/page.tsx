import type { Metadata } from "next";
import Link from "next/link";
import { QuestionBank } from "@/components/questions/QuestionBank";
import { bankItems } from "@/data/bank-items";

/** The day every link in data/question-bank.ts was fetched and its claims spot-checked against the page text. */
const CHECKED_ON = "2026-11-08";

export const metadata: Metadata = {
  title: "Question bank | Web Lore",
  description: "Interview questions on the tricks behind real websites and on how the web renders, each with an answer and links to the sources.",
};

/** Static page (no data fetching): built once, like the lessons. */
export default function QuestionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14 lg:px-10">
      <Link href="/" className="btn-ghost">
        ← Home
      </Link>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--state-learning)]">Question bank</p>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
        {bankItems.length} questions, easy to tricky
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed lg:text-lg text-[var(--color-text-muted)]">
        Try to answer out loud first, then open the answer. Every answer links to an official source (MDN, web.dev, react.dev,
        nextjs.org, Google Search Central). On {CHECKED_ON} every link was checked to load, and every number in a foundations answer was checked against the pages it
        cites. Companies change their systems and docs change, so if something looks different, trust the source.
      </p>
      <div className="mt-10">
        <QuestionBank />
      </div>
    </div>
  );
}
