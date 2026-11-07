import { conceptMap } from "@/data/concepts";
import { LEVELS, questionBank, type Level } from "@/data/question-bank";
import { trickMap } from "@/data/tricks";
import { sourcesFor, trickQuestions } from "@/data/trick-questions";

export type BankGroup = "tricks" | "foundations";

/** One row of the question bank, whichever list it came from. */
export interface BankItem {
  key: string;
  group: BankGroup;
  level: Level;
  /** The trick or concept the question belongs to. */
  label: string;
  question: string;
  answer: string;
  related: string[];
  learnMore: { title: string; url: string }[];
  /** Where this site teaches it. */
  lesson: { href: string; title: string };
}

const ORDER = LEVELS.map((l) => l.id);

// Tricks first, easy to tricky (Array.prototype.sort is stable, so ties keep their order).
const trickItems: BankItem[] = trickQuestions
  .map(
    (q, i): BankItem => ({
      key: `trick-${q.trick}-${i}`,
      group: "tricks",
      level: q.level,
      label: trickMap[q.trick].title,
      question: q.question,
      answer: q.answer,
      related: q.related,
      learnMore: [...sourcesFor(q.trick), ...(q.extra ?? [])],
      lesson: { href: `/trick/${q.trick}`, title: `The trick: ${trickMap[q.trick].title}` },
    }),
  )
  .sort((a, b) => ORDER.indexOf(a.level) - ORDER.indexOf(b.level));

const foundationItems: BankItem[] = questionBank.map(
  (q): BankItem => ({
    key: `concept-${q.id}`,
    group: "foundations",
    level: q.level,
    label: conceptMap[q.concept].title,
    question: q.question,
    answer: q.answer,
    related: q.related,
    learnMore: q.learnMore,
    lesson: { href: `/learn/${q.concept}`, title: `This site's lesson: ${conceptMap[q.concept].title}` },
  }),
);

export const bankItems: BankItem[] = [...trickItems, ...foundationItems];
