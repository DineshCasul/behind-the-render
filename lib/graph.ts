import { concepts, conceptMap } from "@/data/concepts";
import type { ConceptId } from "@/lib/types";

export const VIEW_WIDTH = 1600;
export const VIEW_HEIGHT = 800;

export interface Edge {
  id: string;
  from: ConceptId;
  to: ConceptId;
}

/** One edge per prerequisite relationship, derived from the concept data. */
export const edges: Edge[] = concepts.flatMap((concept) =>
  concept.prerequisites.map((prereqId) => ({
    id: `${prereqId}->${concept.id}`,
    from: prereqId,
    to: concept.id,
  })),
);

/** Direct prerequisites and dependents for a concept — used for hover highlighting. */
export function getNeighbors(id: ConceptId): Set<ConceptId> {
  const neighbors = new Set<ConceptId>();
  for (const edge of edges) {
    if (edge.from === id) neighbors.add(edge.to);
    if (edge.to === id) neighbors.add(edge.from);
  }
  return neighbors;
}

/** Cubic bezier path between two node centers, curving along the dominant (x) axis. */
export function buildEdgePath(
  from: { x: number; y: number },
  to: { x: number; y: number },
): string {
  const dx = to.x - from.x;
  const controlOffset = Math.max(Math.abs(dx) * 0.5, 60);
  const c1x = from.x + controlOffset;
  const c2x = to.x - controlOffset;
  return `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`;
}

export function getPosition(id: ConceptId) {
  return conceptMap[id].position;
}
