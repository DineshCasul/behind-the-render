"use client";

import { useMemo, useState } from "react";
import { concepts, conceptMap } from "@/data/concepts";
import { edges, getNeighbors, VIEW_WIDTH, VIEW_HEIGHT } from "@/lib/graph";
import { useProgress } from "@/lib/progress";
import type { ConceptId } from "@/lib/types";
import { MapNode } from "@/components/learning-map/MapNode";
import { MapEdge } from "@/components/learning-map/MapEdge";
import { MapTooltip } from "@/components/learning-map/MapTooltip";
import { ConceptPanel } from "@/components/learning-map/ConceptPanel";
import { MapLegend } from "@/components/learning-map/MapLegend";

export function LearningMap() {
  const { progress, setStatus } = useProgress();
  const [hoveredId, setHoveredId] = useState<ConceptId | null>(null);
  const [selectedId, setSelectedId] = useState<ConceptId | null>(null);

  const relatedIds = useMemo(
    () => (hoveredId ? getNeighbors(hoveredId) : null),
    [hoveredId],
  );

  const hoveredConcept = hoveredId ? conceptMap[hoveredId] : null;
  const selectedConcept = selectedId ? conceptMap[selectedId] : null;

  return (
    <section
      aria-label="Interactive rendering concept map"
      className="relative mx-auto w-full max-w-6xl px-2 pb-16 sm:px-6"
    >
      <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-auto w-full"
          role="presentation"
        >
          <defs>
            <filter id="node-glow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          <g>
            {edges.map((edge) => {
              const emphasized =
                hoveredId !== null && (edge.from === hoveredId || edge.to === hoveredId);
              const dimmed =
                hoveredId !== null && !emphasized;
              return (
                <MapEdge
                  key={edge.id}
                  id={edge.id}
                  from={conceptMap[edge.from]}
                  to={conceptMap[edge.to]}
                  fromStatus={progress[edge.from]}
                  toStatus={progress[edge.to]}
                  emphasized={emphasized}
                  dimmed={dimmed}
                />
              );
            })}
          </g>

          <g>
            {concepts.map((concept) => {
              const isHovered = hoveredId === concept.id;
              const isRelated = relatedIds?.has(concept.id) ?? false;
              const emphasized = isHovered || isRelated;
              const dimmed = hoveredId !== null && !emphasized;
              return (
                <MapNode
                  key={concept.id}
                  concept={concept}
                  status={progress[concept.id]}
                  emphasized={emphasized}
                  dimmed={dimmed}
                  selected={selectedId === concept.id}
                  onHover={setHoveredId}
                  onSelect={setSelectedId}
                />
              );
            })}
          </g>
        </svg>

        <MapTooltip
          concept={selectedId ? null : hoveredConcept}
          status={hoveredId ? progress[hoveredId] : null}
        />

        <ConceptPanel
          concept={selectedConcept}
          progress={progress}
          onSetStatus={setStatus}
          onClose={() => setSelectedId(null)}
        />

        <MapLegend />
      </div>
    </section>
  );
}
