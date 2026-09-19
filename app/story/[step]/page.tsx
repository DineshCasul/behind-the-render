import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryStepView } from "@/components/story/StoryStepView";
import { storyMap, storySteps } from "@/data/story";

interface StoryPageProps {
  params: Promise<{ step: string }>;
}

/** Every step is known ahead of time, so each page is built once (SSG). */
export function generateStaticParams() {
  return storySteps.map((s) => ({ step: s.id }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { step } = await params;
  const s = storyMap[step];
  return s ? { title: `${s.title} | Behind the Render`, description: s.aside } : {};
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { step } = await params;
  const s = storyMap[step];
  if (!s) notFound();
  return <StoryStepView step={s} />;
}
