import type { Metadata } from "next";
import { JourneyPicker } from "@/components/journey/JourneyPicker";
import { journeys } from "@/data/journey";

export const metadata: Metadata = {
  title: "Choose a road | Web Lore",
  description: `Follow one click from your finger to the screen, through the web in general or through ${journeys.filter((j) => j.kind !== "start").length} real sites, each told in the company's own words.`,
};

export default function JourneyIndexPage() {
  return <JourneyPicker />;
}
