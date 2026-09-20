import type { ConceptId } from "@/lib/types";
import { conceptMap } from "@/data/concepts";
import { connections, type ConceptLink } from "@/data/connections";
import { DirectionalLink } from "@/components/lesson/DirectionalLink";

/**
 * Two plain lines that make the lessons read as a sequence rather than 16
 * islands: one under the title (what this builds on, for someone who jumped
 * straight here) and one near the end (what it leaves open and where to go
 * next). Deliberately not cards or boxes, just sentences with links. Server
 * Component; the links are DirectionalLinks so the page slides back for
 * "read this first" and forward for "next".
 */
const linkClass =
  "whitespace-nowrap text-[var(--state-learning)] underline decoration-[var(--state-learning)]/40 underline-offset-4 transition-colors hover:decoration-[var(--state-learning)]";

function Ref({ id, direction }: { id: ConceptId; direction: "back" | "forward" }) {
  return (
    <DirectionalLink href={`/learn/${id}`} direction={direction} className={linkClass}>
      {direction === "back" ? "← " : ""}
      {conceptMap[id].title}
      {direction === "forward" ? " →" : ""}
    </DirectionalLink>
  );
}

/** "A (note), B (note)" with the right joining words. */
function List({ items, direction }: { items: ConceptLink[]; direction: "back" | "forward" }) {
  return (
    <>
      {items.map((it, i) => (
        <span key={it.id}>
          {i > 0 && (i === items.length - 1 ? " and " : ", ")}
          <Ref id={it.id} direction={direction} /> <span className="text-[var(--color-text-muted)]">({lowerFirst(it.note)})</span>
        </span>
      ))}
    </>
  );
}

const lowerFirst = (s: string) => s.replace(/\.$/, "").replace(/^[A-Z](?![A-Z])/, (c) => c.toLowerCase());

/** Under the lesson title. */
export function ChainIntro({ id }: { id: ConceptId }) {
  const c = connections[id];
  return (
    <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
      <span className="font-medium text-[var(--color-text-primary)]">Where this fits:</span> {c.because}{" "}
      {c.builtOn.length > 0 ? (
        <>
          It builds on <List items={c.builtOn} direction="back" />. Jumped straight here? Read {c.builtOn.length > 1 ? "those" : "that"} first,
          then come back.
        </>
      ) : (
        <>This is the start of the chain, so there is nothing to read first.</>
      )}
    </p>
  );
}

/** Near the end of the lesson, above the related-concept chips. */
export function ChainOutro({ id }: { id: ConceptId }) {
  const c = connections[id];
  return (
    <div className="mb-4 flex flex-col gap-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
      <p>
        <span className="font-medium text-[var(--color-text-primary)]">What this leaves open:</span> {c.leaves}
      </p>
      {c.leadsTo.length > 0 && (
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Next in the chain:</span> <List items={c.leadsTo} direction="forward" />.
        </p>
      )}
      {c.alsoTies.length > 0 && (
        <p>
          <span className="font-medium text-[var(--color-text-primary)]">Also ties into:</span> <List items={c.alsoTies} direction="forward" />.
        </p>
      )}
    </div>
  );
}
