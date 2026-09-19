import type { ConceptId, Lesson } from "@/lib/types";
import { webFundamentalsLessons } from "@/data/lessons/web-fundamentals";
import { renderingStrategiesLessons } from "@/data/lessons/rendering-strategies";
import { reactNextjsLessons } from "@/data/lessons/react-nextjs";
import { modernDeliveryLessons } from "@/data/lessons/modern-delivery";
import { productionConcernsLessons } from "@/data/lessons/production-concerns";

/**
 * Lesson content is authored grouped by pipeline stage (one file per
 * stage, not one file per concept), mirroring the project's own
 * WEB FUNDAMENTALS → ... → PRODUCTION CONCERNS progression rather than
 * producing 12 near-empty files. This index just flattens them into a
 * lookup map, which is the only shape the rest of the app needs.
 */
export const lessonMap: Record<ConceptId, Lesson> = Object.fromEntries(
  [
    ...webFundamentalsLessons,
    ...renderingStrategiesLessons,
    ...reactNextjsLessons,
    ...modernDeliveryLessons,
    ...productionConcernsLessons,
  ].map((lesson) => [lesson.id, lesson]),
) as Record<ConceptId, Lesson>;

export function getLesson(id: ConceptId): Lesson {
  return lessonMap[id];
}
