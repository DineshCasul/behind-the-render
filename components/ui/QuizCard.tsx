"use client";

import { useState } from "react";
import type { Quiz } from "@/data/journey";

/**
 * A guess-first question. Picking an option locks it, marks the right answer green (a wrong pick red)
 * and shows why. The same behaviour as the questions in the story walks.
 */
export function QuizCard({ label, quiz }: { label: string; quiz: Quiz }) {
  const [picked, setPicked] = useState<number | undefined>(undefined);
  const answered = picked !== undefined;

  return (
    <div className="mt-8">
      <p className="label"># {label}</p>
      <p className="read mt-1 !text-lg !text-[var(--color-text-primary)] sm:!text-xl">{quiz.question}</p>
      <div className="mt-3 flex flex-col items-start gap-2" role="group" aria-label="Choices">
        {quiz.options.map((option, i) => {
          const isAnswer = i === quiz.answer;
          const color = !answered ? "var(--color-border)" : isAnswer ? "var(--state-got-it)" : i === picked ? "var(--state-revisit)" : "var(--color-border)";
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className="border px-4 py-2 text-left font-[family-name:var(--font-read)] text-lg transition-colors enabled:hover:border-[var(--state-learning)] disabled:cursor-default"
              style={{ borderColor: color, opacity: answered && !isAnswer && i !== picked ? 0.4 : 1 }}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <p role="status" className="read mt-3">
          <span style={{ color: picked === quiz.answer ? "var(--state-got-it)" : "var(--state-revisit)" }}>{picked === quiz.answer ? "correct. " : "not quite. "}</span>
          {quiz.reveal}
        </p>
      )}
    </div>
  );
}
