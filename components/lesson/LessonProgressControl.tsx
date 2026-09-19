"use client";

import type { ConceptId } from "@/lib/types";
import { useProgress } from "@/lib/progress";
import { StatusPicker } from "@/components/lesson/StatusPicker";

/**
 * The one client boundary the otherwise-static lesson page needs: reading
 * localStorage-backed progress requires `useProgress`, which requires
 * "use client". Isolating it here (instead of making the whole lesson
 * page a Client Component) keeps everything else, the actual lesson
 * prose, which never changes after paint, server-rendered.
 */
export function LessonProgressControl({ conceptId }: { conceptId: ConceptId }) {
  const { progress, setStatus } = useProgress();
  return <StatusPicker conceptId={conceptId} current={progress[conceptId]} onSetStatus={setStatus} />;
}
