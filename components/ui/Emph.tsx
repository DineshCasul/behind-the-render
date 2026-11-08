import { Fragment } from "react";

/**
 * Prose with its numbers picked out. Reading is mostly scanning, and the number
 * is usually the point ("27 second", "80 percent", "99.99%"), so it is set
 * brighter and heavier than the sentence around it. Only digits with a unit
 * count, so "Tier 1" or "HTTP 2" stay plain. Pure string handling, so it works
 * in Server Components and adds no JavaScript to the page.
 */
const NUMBER = /(\b\d[\d.,]*(?:%|x\b| ?(?:ms|KB|MB|GB|seconds?|minutes?|percent|shards|databases|nodes)\b))/g;

export function Emph({ text }: { text: string }) {
  const parts = text.split(NUMBER);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="emph">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
