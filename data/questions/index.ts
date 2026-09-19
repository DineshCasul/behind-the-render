import type { ConceptId, InterviewQuestion } from "@/lib/types";
import { webFundamentalsQuestions } from "@/data/questions/web-fundamentals";
import { renderingStrategiesQuestions } from "@/data/questions/rendering-strategies";
import { reactNextjsQuestions } from "@/data/questions/react-nextjs";
import { modernDeliveryQuestions } from "@/data/questions/modern-delivery";
import { productionConcernsQuestions } from "@/data/questions/production-concerns";

export const questionMap: Record<ConceptId, InterviewQuestion[]> = {
  ...webFundamentalsQuestions,
  ...renderingStrategiesQuestions,
  ...reactNextjsQuestions,
  ...modernDeliveryQuestions,
  ...productionConcernsQuestions,
} as Record<ConceptId, InterviewQuestion[]>;

export function getQuestions(id: ConceptId): InterviewQuestion[] {
  return questionMap[id] ?? [];
}
