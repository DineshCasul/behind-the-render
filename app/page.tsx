import { SiteIndex, TrickIndex } from "@/components/ui/Index";

export default function Home() {
  return (
    <main className="fade-in mx-auto w-full max-w-5xl flex-1 px-5 py-12 lg:px-10">
      <h1 className="text-3xl text-[var(--color-text-primary)]">Web Lore</h1>
      <p className="read mt-3">
        The engineering and algorithms inside real websites. Every claim is quoted from the company&apos;s own docs, with a link.
      </p>

      <h2 className="mt-14 mb-4 text-[var(--state-learning)]">$ ls tricks/</h2>
      <TrickIndex />

      <h2 className="mt-14 mb-4 text-[var(--state-learning)]">$ ls sites/</h2>
      <SiteIndex />
    </main>
  );
}
