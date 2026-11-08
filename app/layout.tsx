import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Monospace for the chrome (header, labels, lists, code) so the site still reads like a terminal.
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });
// A sans only for text you read in sentences (explanations, quotes, narration). Long prose in
// monospace is slow to read; this is the one place the site leaves the terminal look.
const plexSans = IBM_Plex_Sans({ variable: "--font-read", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Web Lore",
  description: "The engineering and algorithms inside real websites, in the companies' own words.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${plexSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-mono">
        <header className="flex h-12 shrink-0 items-center gap-6 border-b border-[var(--color-border)] px-5 text-xs lg:px-10">
          <Link href="/" className="text-[var(--color-text-primary)]">
            <span className="text-[var(--state-got-it)]">~</span> web-lore <span className="caret text-[var(--state-got-it)]">_</span>
          </Link>
          <nav className="flex gap-5 text-[var(--color-text-muted)]">
            <Link href="/journey" className="hover:text-[var(--color-text-primary)]">sites</Link>
            <Link href="/trick" className="hover:text-[var(--color-text-primary)]">tricks</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
