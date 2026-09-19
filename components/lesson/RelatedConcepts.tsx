import type { ConceptId } from "@/lib/types";
import { conceptMap } from "@/data/concepts";
import { DirectionalLink } from "@/components/lesson/DirectionalLink";

/**
 * Prerequisites get a ← (the new page slides in from the left, as if going
 * back a step in the learning flow); concepts that build on this one get a →
 * (slides in from the right). The arrow tells you the direction before you click.
 */
export function RelatedConcepts({ currentId, ids }: { currentId: ConceptId; ids: ConceptId[] }) {
  if (ids.length === 0) return null;
  const prerequisites = conceptMap[currentId].prerequisites;

  return (
    <div className="flex flex-wrap gap-2">
      {ids.map((id) => {
        const isPrerequisite = prerequisites.includes(id);
        return (
          <DirectionalLink
            key={id}
            href={`/learn/${id}`}
            direction={isPrerequisite ? "back" : "forward"}
            className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-primary)] transition-colors hover:border-[var(--state-learning)] hover:text-[var(--state-learning)]"
          >
            {isPrerequisite ? "← " : ""}
            {conceptMap[id].title}
            {isPrerequisite ? "" : " →"}
          </DirectionalLink>
        );
      })}
    </div>
  );
}
