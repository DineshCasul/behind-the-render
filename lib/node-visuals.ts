import type { NodeStatus } from "@/lib/types";

export interface StatusVisual {
  color: string;
  glyph: string;
  /** Outer glow blur opacity, how "lit up" the node looks. */
  glowOpacity: number;
  /** Fill opacity of the node disc itself. */
  fillOpacity: number;
  /** Whether the ring should breathe/pulse. */
  animated: boolean;
}

export const STATUS_VISUALS: Record<NodeStatus, StatusVisual> = {
  "not-started": {
    color: "var(--state-not-started)",
    glyph: "○",
    glowOpacity: 0,
    fillOpacity: 0.04,
    animated: false,
  },
  learning: {
    color: "var(--state-learning)",
    glyph: "◐",
    glowOpacity: 0.35,
    fillOpacity: 0.12,
    animated: true,
  },
  "got-it": {
    color: "var(--state-got-it)",
    glyph: "✦",
    glowOpacity: 0.45,
    fillOpacity: 0.18,
    animated: false,
  },
  revisit: {
    color: "var(--state-revisit)",
    glyph: "⟲",
    glowOpacity: 0.4,
    fillOpacity: 0.14,
    animated: true,
  },
  mastered: {
    color: "var(--state-mastered)",
    glyph: "✦",
    glowOpacity: 0.75,
    fillOpacity: 0.28,
    animated: false,
  },
};
