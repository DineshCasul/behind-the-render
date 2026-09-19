import type { ConceptExamples, ConceptId } from "@/lib/types";
import { webFundamentalsExamples } from "@/data/examples/web-fundamentals";
import { renderingStrategiesExamples } from "@/data/examples/rendering-strategies";
import { reactNextjsExamples } from "@/data/examples/react-nextjs";
import { modernDeliveryExamples } from "@/data/examples/modern-delivery";
import { productionConcernsExamples } from "@/data/examples/production-concerns";

/**
 * Worked examples, authored per pipeline stage like the lessons. The
 * `Record<ConceptId, ...>` type means TypeScript fails the build if a concept
 * is ever added without its examples.
 */
export const examples: Record<ConceptId, ConceptExamples> = {
  ...webFundamentalsExamples,
  ...renderingStrategiesExamples,
  ...reactNextjsExamples,
  ...modernDeliveryExamples,
  ...productionConcernsExamples,
};
