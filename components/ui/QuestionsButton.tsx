import Link from "next/link";
import { questionBank } from "@/data/question-bank";

/** Secondary call to action on the home page: the question bank. */
export function QuestionsButton() {
  return (
    <Link href="/questions" className="btn-ghost btn-ghost-lg">
      Take the {questionBank.length}-question challenge
    </Link>
  );
}
