import type { ConceptExamples } from "@/lib/types";

export const productionConcernsExamples: Record<"caching", ConceptExamples> = {
  caching: {
    whatIsThis: {
      title: "The two Cache-Control headers this site sends in production",
      snippets: [
        {
          lang: "http",
          caption: "A prebuilt page (measured with next start)",
          fromSite: true,
          code: "Cache-Control: s-maxage=31536000",
        },
        {
          lang: "http",
          caption: "A hashed JavaScript or CSS file",
          fromSite: true,
          code: "Cache-Control: public, max-age=31536000, immutable",
        },
      ],
      notice: [
        "`s-maxage` is for shared caches such as a CDN: it may keep the page for a year (31,536,000 seconds).",
        "`immutable` tells the browser this file's name changes whenever its content does, so it never needs to check again.",
      ],
    },
    howItWorks: {
      title: "Asking \"has this changed?\" instead of downloading again",
      snippets: [
        {
          lang: "http",
          code: "GET /logo.png HTTP/1.1\nIf-None-Match: \"abc123\"        // the version I already have\n\nHTTP/1.1 304 Not Modified       // still the same: use your copy (no body sent)",
          mark: [2, 4],
        },
      ],
      notice: [
        "When a saved copy has expired, the browser can still ask the server whether it changed.",
        "A `304` reply carries no body, so confirming an unchanged file is much cheaper than sending it again.",
      ],
    },
    reactNext: {
      title: "Opting in to caching in Next.js 16",
      snippets: [
        {
          lang: "ts",
          caption: "next.config.ts",
          code: "const nextConfig = {\n  cacheComponents: true,   // switches on the newer caching model\n};",
        },
        {
          lang: "ts",
          caption: "Any async function you want to cache",
          code: "export async function getLessons() {\n  \"use cache\";\n  return db.query(\"select * from lessons\");\n}",
        },
      ],
      notice: [
        "Nothing is cached by default: you mark what should be, with the `\"use cache\"` directive.",
        "This site has no data fetching, so it doesn't use this. The caching it benefits from is the CDN and browser caching described in the first example.",
      ],
    },
  },
};
