import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Journey } from "@/components/journey/Journey";
import { journeyMap, journeys } from "@/data/journey";
import { trickMap } from "@/data/tricks";

interface JourneyPageProps {
  params: Promise<{ app: string }>;
}

/**
 * The list of roads is fixed, so every `/journey/<app>` page is prerendered at
 * build time (the same trick as the lesson pages). The title, the first
 * subtitle and the full transcript are in the HTML before any JavaScript runs.
 */
export function generateStaticParams() {
  return journeys.map((j) => ({ app: j.id }));
}

export async function generateMetadata({ params }: JourneyPageProps): Promise<Metadata> {
  const { app } = await params;
  const journey = journeyMap[app];
  if (!journey) return {};
  return {
    title: `${journey.name} | The Journey | Web Lore`,
    description: journey.blurb,
  };
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { app } = await params;
  const journey = journeyMap[app];
  if (!journey) notFound();
  // A road whose tricks include a toy gets a "poke the toy" link on its last card.
  const toyTrick = journey.chapters.map((c) => c.trick).find((slug) => slug && trickMap[slug]?.toy);
  // The name of each chapter's trick, shown under the chapter title.
  const trickTitles = Object.fromEntries(
    journey.chapters.flatMap((c) => (c.trick && trickMap[c.trick] ? [[c.trick, trickMap[c.trick].title] as const] : [])),
  );
  return <Journey app={journey} toyTrick={toyTrick} trickTitles={trickTitles} />;
}
