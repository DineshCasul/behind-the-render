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

interface LearningMapProps {
  /**
   * When true, the map sheds its framed "card" look (max width, padding,
   * rounded corners) and expands edge-to-edge, becoming the primary view
   * instead of one section on the page. Driven by scroll position — see
   * ScrollExperience.tsx.
   */
  expanded?: boolean;
}

export function LearningMap({ expanded = false }: LearningMapProps) {
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
      className={`relative mx-auto w-full pb-16 transition-[max-width,padding] duration-700 ease-out ${
        expanded ? "max-w-none px-0" : "max-w-6xl px-2 sm:px-6"
      }`}
    >
      {/*
        A CSS grid, not an overlay: the concept panel is a real second
        column, not something absolutely positioned on top of the map.
        Opening it shrinks the map's column (grid-template-columns
        transition) instead of covering nodes that happen to sit under
        it — every node stays visible, just at a slightly smaller scale.
      */}
      <div
        className="grid transition-[grid-template-columns,gap] duration-300 ease-out"
        style={{
          gridTemplateColumns: selectedConcept ? "minmax(0,1fr) 20rem" : "minmax(0,1fr) 0rem",
          gap: selectedConcept ? "1rem" : "0rem",
        }}
      >
        {/*
          overflow-hidden lives on this inner wrapper (clips only the SVG,
          so the rounded card keeps a clean edge) — NOT on the `relative`
          wrapper around it, so the hover tooltip is free to render past
          the SVG's box without being clipped by it.
        */}
        <div className="relative min-w-0">
          <div
            className={`flex items-center overflow-hidden border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 transition-[border-radius,min-height] duration-700 ease-out ${
              expanded ? "min-h-[85vh] rounded-none border-y" : "min-h-0 rounded-xl border"
            }`}
          >
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
          </div>

          <MapTooltip
            concept={selectedId ? null : hoveredConcept}
            status={hoveredId ? progress[hoveredId] : null}
          />

          <MapLegend />
        </div>

        <div className="min-w-0 overflow-hidden">
          <ConceptPanel
            concept={selectedConcept}
            progress={progress}
            onSetStatus={setStatus}
            onClose={() => setSelectedId(null)}
          />
        </div>
      </div>
    </section>
  );
}
