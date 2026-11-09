import type { Metadata } from "next";
import { SiteIndex } from "@/components/ui/Index";
import { WarmWalk } from "@/components/ui/WarmWalk";
import { BackToTop } from "@/components/ui/BackToTop";
import { MarginShapes } from "@/components/ui/MarginShapes";

export const metadata: Metadata = {
  title: "Stories | Web Lore",
  description: "One company's engineering, told chapter by chapter in its own words.",
};

export default function JourneyIndexPage() {
  return (
    <main className="relative fade-in mx-auto w-full max-w-5xl flex-1 px-5 py-12 lg:px-10">
      <MarginShapes seed="sites" count={6} />
      <h1 className="mb-2 text-[var(--state-learning)]">$ ls stories/</h1>
      <p className="read mb-8">
        A story gets an entry only when there is a first-party source to quote: its own docs, its own code, or a case study the company published.
      </p>
      <WarmWalk />
      <SiteIndex />
      <BackToTop />
    </main>
  );
}
