import type { Metadata } from "next";
import Link from "next/link";
import { QuestionBank } from "@/components/questions/QuestionBank";
import { questionBank } from "@/data/question-bank";

/** The day every link in data/question-bank.ts was fetched and its claims spot-checked against the page text. */
const CHECKED_ON = "2026-09-20";

export const metadata: Metadata = {
  title: "Question bank | Behind the Render",
  description: "Questions from easy to tricky on how the modern web renders, each with an answer and a link to the official source.",
};

/** Static page (no data fetching): built once, like the lessons. */
export default function QuestionsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-14">
      <Link href="/" className="btn-ghost">
        ← Home
      </Link>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--state-learning)]">Question bank</p>
      <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        {questionBank.length} questions, easy to tricky
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
        Try to answer out loud first, then open the answer. Every answer links to an official source (MDN, web.dev, react.dev,
        nextjs.org, Google Search Central). Links were checked on {CHECKED_ON}. Docs change, so if something
        looks different, trust the source.
      </p>
      <div className="mt-8">
        <QuestionBank />
      </div>
    </div>
  );
}
