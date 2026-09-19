"use client";

import type { ConceptId, NodeStatus } from "@/lib/types";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/progress";
import { STATUS_VISUALS } from "@/lib/node-visuals";

interface StatusPickerProps {
  conceptId: ConceptId;
  current: NodeStatus;
  onSetStatus: (id: ConceptId, status: NodeStatus) => void;
}

/**
 * The row of 5 status buttons, originally lived only inside ConceptPanel.
 * Phase 2's lesson pages need the exact same control, so it's extracted
 * here rather than duplicated: two call sites is exactly the point where
 * copy-pasting starts costing more than the small indirection of a shared
 * component (a third near-identical copy would be a clear bug magnet the
 * moment one drifts from the other).
 */
export function StatusPicker({ conceptId, current, onSetStatus }: StatusPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STATUS_ORDER.map((status) => {
        const active = current === status;
        return (
          <button
            key={status}
            onClick={() => onSetStatus(conceptId, status)}
            className="rounded-full border px-2.5 py-1 text-[11px] transition-colors"
            style={{
              borderColor: STATUS_VISUALS[status].color,
              color: active ? "#05070a" : STATUS_VISUALS[status].color,
              backgroundColor: active ? STATUS_VISUALS[status].color : "transparent",
            }}
          >
            {STATUS_LABEL[status]}
          </button>
        );
      })}
    </div>
  );
}
