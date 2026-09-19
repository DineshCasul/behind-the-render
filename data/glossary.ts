export interface GlossaryEntry {
  /** Display name shown at the top of the hover card. */
  term: string;
  /** Every spelling in lesson text that should get the hover (matched case-insensitively, whole words). */
  match: string[];
  /** One or two plain sentences, no jargon that isn't itself explained elsewhere. */
  meaning: string;
}

/**
 * Hard words in the lessons. `Prose` scans lesson text for these and
 * underlines the first occurrence in each paragraph with a hover card.
 * Authoring rule: the meaning must be understandable by someone who has
 * never heard the term, using only everyday words.
 */
export const glossary: GlossaryEntry[] = [
  { term: "DOM", match: ["DOM"], meaning: "Document Object Model. The browser's live tree of every element on the page, which JavaScript can read and change." },
  { term: "CSSOM", match: ["CSSOM"], meaning: "The browser's tree of all the CSS rules, built in the same way the DOM is built from HTML." },
  { term: "Render tree", match: ["render tree"], meaning: "The tree of only the things that will actually be drawn. Hidden elements are left out." },
  { term: "Layout", match: ["layout", "reflow"], meaning: "The step where the browser works out the exact size and position of every element. Also called reflow when it has to be redone." },
  { term: "Paint", match: ["paint"], meaning: "The step where the browser fills in the actual pixels: colors, text, borders and images." },
  { term: "Compositing", match: ["compositing", "composite", "compositor"], meaning: "Combining separately painted layers into the final picture, done by the graphics card so it's very fast." },
  { term: "GPU", match: ["GPU"], meaning: "The graphics processor. Hardware that is extremely fast at moving and blending images." },
  { term: "Hydration", match: ["hydration", "hydrate", "hydrated", "hydrates"], meaning: "Attaching JavaScript behavior (click handlers and state) to HTML that was already rendered on the server, so the page becomes interactive." },
  { term: "Reconciliation", match: ["reconciliation", "reconcile"], meaning: "React comparing the new description of the UI with the previous one to find the smallest set of changes to make to the page." },
  { term: "Diffing", match: ["diffs", "diffing"], meaning: "Comparing two versions of something to find exactly what is different between them." },
  { term: "DOM mutation", match: ["DOM mutations", "DOM mutation"], meaning: "A change to the page's elements: adding one, removing one, or editing one." },
  { term: "Virtual DOM", match: ["virtual DOM"], meaning: "A plain JavaScript description of the UI that React keeps and compares between renders. It is not a second browser, just data." },
  { term: "TLS", match: ["TLS"], meaning: "The encryption that makes a connection private. It is the 'S' in HTTPS." },
  { term: "DNS", match: ["DNS"], meaning: "The internet's phone book. It turns a name like example.com into the numeric address of a server." },
  { term: "TCP", match: ["TCP"], meaning: "The reliable-delivery layer under HTTP. It makes sure bytes arrive complete and in order." },
  { term: "QUIC", match: ["QUIC"], meaning: "A newer, faster way to move data (built on UDP) that HTTP/3 uses to avoid some of TCP's slowdowns." },
  { term: "HTTP/2", match: ["HTTP/2"], meaning: "A newer version of HTTP that can send many requests over a single connection at the same time." },
  { term: "Handshake", match: ["handshake"], meaning: "The opening exchange where both sides agree how to talk (and set up encryption) before any real data is sent." },
  { term: "Multiplexing", match: ["multiplexes", "multiplexing"], meaning: "Sending many requests and responses at the same time over one connection instead of one after another." },
  { term: "Head-of-line blocking", match: ["head-of-line-blocks", "head-of-line blocking"], meaning: "When one slow item at the front of a queue holds up everything waiting behind it." },
  { term: "Stateless", match: ["stateless"], meaning: "Remembering nothing between requests. Every request must carry everything needed to answer it." },
  { term: "Headers", match: ["headers"], meaning: "Extra labelled information sent with a request or response, such as the content type or caching rules." },
  { term: "Status code", match: ["status code"], meaning: "A number in the response that says how the request went: 200 means OK, 404 means not found, 500 means the server failed." },
  { term: "API", match: ["API"], meaning: "A defined way for programs to talk to each other. Here it usually means a URL that returns data as JSON." },
  { term: "Latency", match: ["latency"], meaning: "The delay before something happens. Mostly time spent waiting, not working." },
  { term: "Cache", match: ["cache", "cached"], meaning: "A saved copy of something, kept so it doesn't have to be fetched or calculated again." },
  { term: "Cache-Control", match: ["Cache-Control"], meaning: "An HTTP header that tells browsers and CDNs whether, and for how long, they may keep a copy." },
  { term: "CDN", match: ["CDN"], meaning: "Content Delivery Network. A worldwide set of servers that keep copies of your files close to your visitors." },
  { term: "Edge", match: ["edge"], meaning: "A server location close to the visitor, as opposed to your one main server far away." },
  { term: "Origin server", match: ["origin server", "origin"], meaning: "Your real, main server. The CDN goes back to it only when it has no copy of its own." },
  { term: "Revalidation", match: ["revalidation", "revalidate", "revalidating"], meaning: "Checking whether a saved copy is still fresh, and replacing it if it isn't." },
  { term: "Stale-while-revalidate", match: ["stale-while-revalidate"], meaning: "Hand out the old copy immediately, while a fresh copy is prepared in the background for next time." },
  { term: "Invalidation", match: ["invalidation", "invalidate", "invalidating"], meaning: "Marking a saved copy as no longer valid so it gets refreshed the next time it's needed." },
  { term: "Regeneration", match: ["regeneration", "regenerate", "regenerates", "regenerating"], meaning: "Rebuilding a page's HTML again with fresh data." },
  { term: "Bundle", match: ["JavaScript bundle", "JS bundle", "bundle"], meaning: "The JavaScript file (or files) the browser has to download before the app can run." },
  { term: "HTML shell", match: ["HTML shell", "shell"], meaning: "A nearly empty HTML page with no real content, just enough to load the JavaScript that will fill it in." },
  { term: "Parser", match: ["parser"], meaning: "Code that reads plain text and turns it into a structured form the program can work with." },
  { term: "Tokenizing", match: ["tokenizes", "tokenizer", "tokenize"], meaning: "Splitting raw text into small meaningful pieces (tags, text, comments) so it can be processed." },
  { term: "Chunk", match: ["chunk", "chunks"], meaning: "One piece of a larger response, sent separately from the others." },
  { term: "Buffering", match: ["buffering", "buffered", "buffers", "buffer"], meaning: "Holding data back until enough has arrived, instead of passing it on straight away." },
  { term: "Placeholder", match: ["placeholder", "placeholders", "skeleton"], meaning: "A grey stand-in shape shown while the real content is still loading." },
  { term: "Fallback", match: ["fallback"], meaning: "What is shown instead when the real thing isn't ready yet (or has failed)." },
  { term: "Suspense", match: ["Suspense"], meaning: "A React feature that lets one part of the page show a placeholder while it waits for its data." },
  { term: "Serialization", match: ["serialized", "serializes", "serialization"], meaning: "Converting something into plain text or bytes so it can be sent over the network and rebuilt on the other side." },
  { term: "Event handler", match: ["event listeners", "event listener", "event handlers", "click handlers"], meaning: "Code that runs when something happens on the page, like a click or a key press." },
  { term: "Layout shift", match: ["layout shift"], meaning: "Content jumping around on screen because something above it loaded late or changed size." },
  { term: "Crawler", match: ["crawler", "crawlers"], meaning: "A bot (like Google's) that visits pages and reads them so they can show up in search results." },
  { term: "SEO", match: ["SEO"], meaning: "Search Engine Optimization. Making pages easy for search engines to find and understand." },
  { term: "CSR", match: ["CSR"], meaning: "Client-Side Rendering. The browser builds the page using JavaScript after it loads." },
  { term: "SSR", match: ["SSR"], meaning: "Server-Side Rendering. The server builds the page's HTML for each request and sends it finished." },
  { term: "SSG", match: ["SSG"], meaning: "Static Site Generation. Pages are built once when you deploy, then served as ready-made files." },
  { term: "ISR", match: ["ISR"], meaning: "Incremental Static Regeneration. Ready-made pages that get quietly rebuilt in the background now and then." },
  { term: "Client Component", match: ["Client Components", "Client Component"], meaning: "A React component whose code runs in the browser, so it can hold state and respond to clicks." },
  { term: "Server Component", match: ["Server Components", "Server Component"], meaning: "A React component that runs only on the server. Its code is never sent to the browser." },
];
