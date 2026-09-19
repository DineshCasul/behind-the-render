"use client";

import { useMemo, useState } from "react";
import { concepts, conceptMap } from "@/data/concepts";
import {
  edges,
  getNeighbors,
  MOBILE_VIEW_HEIGHT,
  MOBILE_VIEW_WIDTH,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from "@/lib/graph";
import { useProgress } from "@/lib/progress";
import type { ConceptId, ProgressState } from "@/lib/types";
import { MapNode } from "@/components/learning-map/MapNode";
import { MapEdge } from "@/components/learning-map/MapEdge";
import { MapTooltip } from "@/components/learning-map/MapTooltip";
import { ConceptPanel } from "@/components/learning-map/ConceptPanel";
import { MapLegend } from "@/components/learning-map/MapLegend";

interface LearningMapProps {
  /**
   * "wide" is the landscape map used from 1024px up (positions in a
   * 1600x800 space). "tall" is the same graph redrawn top-to-bottom for
   * phones and tablets (360x1010), so node labels stay readable on a 390px screen
   * instead of shrinking a landscape diagram to a quarter of its size.
   * Both are rendered from the same data and the same node/edge components.
   */
  layout?: "wide" | "tall";
  /**
   * When true, the wide map sheds its framed "card" look (max width, padding,
   * rounded corners) and expands edge-to-edge, becoming the primary view
   * instead of one section on the page. Driven by scroll position, see
   * ScrollExperience.tsx.
   */
  expanded?: boolean;
  /** Both layouts can exist in the page at once (one hidden by CSS), so ids must differ. */
  id?: string;
}

interface MapGraphProps {
  layout: "wide" | "tall";
  progress: ProgressState;
  hoveredId: ConceptId | null;
  relatedIds: Set<ConceptId> | null;
  selectedId: ConceptId | null;
  onHover: (id: ConceptId | null) => void;
  onSelect: (id: ConceptId) => void;
}

/** The SVG itself: identical logic for both layouts, only coordinates and curve direction differ. */
function MapGraph({ layout, progress, hoveredId, relatedIds, selectedId, onHover, onSelect }: MapGraphProps) {
  const tall = layout === "tall";
  const positionOf = (id: ConceptId) => (tall ? conceptMap[id].mobilePosition : conceptMap[id].position);
  // Unique per SVG: duplicate ids across a hidden and a visible SVG would make
  // `url(#...)` resolve to whichever comes first, and a gradient or filter that
  // lives inside a `display: none` SVG doesn't render at all.
  const idPrefix = tall ? "tall-" : "wide-";
  const glowId = `${idPrefix}node-glow`;

  return (
    <svg
      viewBox={tall ? `0 0 ${MOBILE_VIEW_WIDTH} ${MOBILE_VIEW_HEIGHT}` : `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className={tall ? "block h-auto w-full" : "h-auto max-h-full w-full"}
      role="presentation"
    >
      <defs>
        <filter id={glowId} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation={tall ? 10 : 14} />
        </filter>
      </defs>

      <g>
        {edges.map((edge) => {
          const emphasized = hoveredId !== null && (edge.from === hoveredId || edge.to === hoveredId);
          const dimmed = hoveredId !== null && !emphasized;
          return (
            <MapEdge
              key={edge.id}
              id={edge.id}
              idPrefix={idPrefix}
              vertical={tall}
              fromPos={positionOf(edge.from)}
              toPos={positionOf(edge.to)}
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
              position={positionOf(concept.id)}
              glowId={glowId}
              status={progress[concept.id]}
              emphasized={emphasized}
              dimmed={dimmed}
              selected={selectedId === concept.id}
              onHover={onHover}
              onSelect={onSelect}
            />
          );
        })}
      </g>
    </svg>
  );
}

export function LearningMap({ layout = "wide", expanded = false, id }: LearningMapProps) {
  const { progress, setStatus } = useProgress();
  const [hoveredId, setHoveredId] = useState<ConceptId | null>(null);
  const [selectedId, setSelectedId] = useState<ConceptId | null>(null);

  const relatedIds = useMemo(
    () => (hoveredId ? getNeighbors(hoveredId) : null),
    [hoveredId],
  );

  const hoveredConcept = hoveredId ? conceptMap[hoveredId] : null;
  const selectedConcept = selectedId ? conceptMap[selectedId] : null;

  const graphProps = { progress, hoveredId, relatedIds, selectedId, onHover: setHoveredId, onSelect: setSelectedId };

  if (layout === "tall") {
    return (
      <section
        id={id ?? "map-mobile"}
        aria-label="Interactive rendering concept map"
        className="relative mx-auto w-full max-w-lg px-3 pb-16"
      >
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40">
          <MapGraph layout="tall" {...graphProps} />
        </div>

        {/* In flow under the map, not pinned over it, so it can't cover nodes or the panel. */}
        <MapLegend inline />

        {/* No hover tooltip here: touch screens have no hover. Tapping a node opens the sheet instead. */}
        <ConceptPanel
          variant="sheet"
          concept={selectedConcept}
          progress={progress}
          onSetStatus={setStatus}
          onClose={() => setSelectedId(null)}
        />
      </section>
    );
  }

  return (
    <section
      id={id ?? "map"}
      aria-label="Interactive rendering concept map"
      className={`relative mx-auto h-full w-full transition-[max-width,padding] duration-700 ease-out ${
        // max-w-[100rem] (1600px) matches the SVG's own viewBox width, so
        // at a wide enough viewport the map renders at roughly 1 SVG unit
        // = 1px, as crisp as it gets. It also means there's still a lot
        // of room left over after the concept panel's fixed 20rem takes
        // its share, so opening the panel doesn't shrink node labels down
        // to the point of being hard to read. `h-full` only matters when
        // a definite-height ancestor exists (the pinned scroll scene),
        // against the normal in-flow page it resolves to auto, harmless.
        expanded ? "max-w-none px-0" : "max-w-[100rem] px-2 pb-16 sm:px-6"
      }`}
    >
      {/*
        A CSS grid, not an overlay: the concept panel is a real second
        column, not something absolutely positioned on top of the map.
        Opening it shrinks the map's column (grid-template-columns
        transition) instead of covering nodes that happen to sit under
        it, every node stays visible, just at a slightly smaller scale.
      */}
      <div
        // `grid-rows-[minmax(0,1fr)]` caps the single row at the container's height.
        // With an auto row, a map SVG taller than the screen (wide-but-short
        // windows, since it keeps a 2:1 shape) made the row, and everything in
        // it, grow past the viewport: the legend and the bottom of the map fell
        // off-screen. Now the SVG shrinks to fit instead.
        className="grid h-full grid-rows-[minmax(0,1fr)] transition-[grid-template-columns,gap] duration-300 ease-out"
        style={{
          gridTemplateColumns: selectedConcept ? "minmax(0,1fr) 20rem" : "minmax(0,1fr) 0rem",
          gap: selectedConcept ? "1rem" : "0rem",
        }}
      >
        {/*
          overflow-hidden lives on this inner wrapper (clips only the SVG,
          so the rounded card keeps a clean edge), NOT on the `relative`
          wrapper around it, so the hover tooltip is free to render past
          the SVG's box without being clipped by it.
        */}
        <div className="relative h-full min-w-0">
          <div
            className={`flex h-full items-center justify-center overflow-hidden border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 transition-[border-radius] duration-700 ease-out ${
              expanded ? "rounded-none border-y" : "rounded-xl border"
            }`}
          >
            <MapGraph layout="wide" {...graphProps} />
          </div>

          {/*
            Only suppress the tooltip for the exact node whose panel is
            already open (redundant with the panel's own info), hovering
            any *other* node should still preview it, panel or not.
          */}
          <MapTooltip
            concept={hoveredId && hoveredId !== selectedId ? hoveredConcept : null}
            status={hoveredId ? progress[hoveredId] : null}
          />

          <MapLegend />
        </div>

        <div className="h-full min-w-0 overflow-hidden">
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
