import type { Metadata } from "next";
import { SiteIndex } from "@/components/ui/Index";

export const metadata: Metadata = {
  title: "Sites | Web Lore",
  description: "One click followed through real sites, each told in the company's own words.",
};

export default function JourneyIndexPage() {
  return (
    <main className="fade-in mx-auto w-full max-w-5xl flex-1 px-5 py-12 lg:px-10">
      <h1 className="mb-2 text-[var(--state-learning)]">$ ls sites/</h1>
      <p className="read mb-8">
        A site gets an entry only when there is a first-party source to quote: its own docs, its own code, or a case study the company published.
      </p>
      <SiteIndex />
    </main>
  );
}
