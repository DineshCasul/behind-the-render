// Checks every quote in the data files against the live page it links to, word for word.
//
//   npm run verify:quotes                 (checks data/journey.ts, journey-more.ts and journey-deep.ts)
//   node scripts/verify-quotes.mjs <file> (checks one file)
//
// Run it after ANY edit to a quote. It finds each `{ text, source, href }` entry, fetches the
// page, and tests that the quote appears in the page text EXACTLY: the same words, the same
// capitals, the same curly or straight quotes, the same dashes. Only layout is forgiven
// (HTML entities, runs of whitespace, a space left where a link or tag sat next to punctuation).
//
// A quote cut out of a longer sentence uses a leading or trailing "…", and each piece is
// tested separately. A quote that matches only after ignoring case, quote style or dashes is
// reported as a PUNCTUATION MISMATCH: published wording must be reproduced as published.
//
// A network error is reported as such. It is never counted as "quote missing", because a
// 504 from a host says nothing about the quote.

import { readFileSync } from "node:fs";

const ELLIPSIS = String.fromCodePoint(0x2026);

const files = process.argv.slice(2);
if (files.length === 0) files.push("data/journey.ts", "data/journey-more.ts", "data/journey-deep.ts", "data/journey-api.ts", "data/journey-web.ts");

const HEADERS = {
  "user-agent": "Mozilla/5.0 (compatible; web-lore-quote-check)",
  accept: "text/html,application/xhtml+xml",
};

const NAMED = {
  amp: "&",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: String.fromCodePoint(0x2019),
  lsquo: String.fromCodePoint(0x2018),
  rdquo: String.fromCodePoint(0x201d),
  ldquo: String.fromCodePoint(0x201c),
  mdash: String.fromCodePoint(0x2014),
  ndash: String.fromCodePoint(0x2013),
  hellip: ELLIPSIS,
};

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
    .replace(/ /g, " ");

/** Exact match: only layout is forgiven. */
const exact = (s) =>
  decode(s)
    .replace(/\s+([.,;:!?)])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+/g, " ")
    .trim();

/** Loose match, used only to tell a punctuation mismatch from a quote that is not on the page. */
const loose = (s) =>
  exact(s)
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase();

const toText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ");

/** Fetch with a few retries for the resets and gateway errors that big hosts throw now and then. */
async function get(url) {
  let last;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS, redirect: "follow" });
      if (res.status < 500) return res;
      last = new Error("HTTP " + res.status);
    } catch (err) {
      last = err;
    }
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
  throw last;
}

/** web.dev serves the language it guesses, so ask for English. A GitHub repo page falls back to its raw README. */
async function pageText(href) {
  const target = href.includes("web.dev") && !href.includes("hl=") ? href + "?hl=en" : href;
  try {
    const res = await get(target);
    if (res.ok) return exact(toText(await res.text()));
    throw new Error("HTTP " + res.status);
  } catch (err) {
    const repo = href.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/);
    if (repo) {
      for (const branch of ["master", "main"]) {
        const raw = await fetch(`https://raw.githubusercontent.com/${repo[1]}/${repo[2]}/${branch}/README.md`).catch(() => null);
        if (raw?.ok) return exact(await raw.text());
      }
    }
    throw err;
  }
}

let checked = 0;
let missing = 0;
let mismatched = 0;
let unreachable = 0;
const cache = new Map();

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const urls = Object.fromEntries([...src.matchAll(/const (\w+) = "(https?:[^"]+)";/g)].map((m) => [m[1], m[2]]));
  const entries = [...src.matchAll(/text: "((?:[^"\\]|\\.)*)",\s*source: "[^"]*",\s*href: (\w+)\s*[,}]/g)];

  for (const [, raw, hrefName] of entries) {
    const text = JSON.parse('"' + raw + '"');
    const href = urls[hrefName];
    checked++;
    if (!href) {
      missing++;
      console.log(`NO URL CONSTANT "${hrefName}" for: ${text.slice(0, 80)}`);
      continue;
    }
    if (!cache.has(href)) cache.set(href, pageText(href).catch((err) => ({ error: err })));
    const page = await cache.get(href);
    if (typeof page !== "string") {
      unreachable++;
      console.log(`UNREACHABLE (${page.error?.message ?? page.error}): ${href}`);
      continue;
    }
    const pieces = text.split(ELLIPSIS).map(exact).filter(Boolean);
    if (pieces.every((p) => page.includes(p))) continue;
    const loosePage = loose(page);
    if (pieces.every((p) => loosePage.includes(loose(p)))) {
      mismatched++;
      console.log(`PUNCTUATION MISMATCH (case, quote style or dash differs from the page): ${text.slice(0, 110)}\n    ${href}`);
    } else {
      missing++;
      console.log(`NOT FOUND: ${text.slice(0, 120)}\n    ${href}`);
    }
  }
}

console.log(`${checked} quotes checked: ${missing} not found, ${mismatched} punctuation mismatches, ${unreachable} on unreachable pages`);
process.exit(missing + mismatched > 0 ? 1 : 0);
