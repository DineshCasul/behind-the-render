import type { Metadata } from "next";
import { TrickIndex } from "@/components/ui/Index";
import { BackToTop } from "@/components/ui/BackToTop";
import { MarginShapes } from "@/components/ui/MarginShapes";

export const metadata: Metadata = {
  title: "Tricks | Web Lore",
  description: "The named ideas and algorithms behind how real websites work, each with its sources.",
};

export default function TrickIndexPage() {
  return (
    <main className="relative fade-in mx-auto w-full max-w-5xl flex-1 px-5 py-12 lg:px-10">
      <MarginShapes seed="tricks" count={7} />
      <h1 className="mb-6 text-[var(--state-learning)]">$ ls tricks/</h1>
      <TrickIndex />
      <BackToTop />
    </main>
  );
}
