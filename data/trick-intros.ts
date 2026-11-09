/**
 * The "ever wondered" opener for each trick, keyed by trick slug. Written for
 * someone who has never heard of the company or the problem: what it is, why it
 * hurts, why the answer is interesting.
 *
 * Rules: the tone is casual and a little cheeky, and the jokes never change a
 * fact. Every fact here is already in that trick's verified quotes (data/journey.ts,
 * data/journey-more.ts); the rest is plain framing. No new numbers. No em dashes.
 * Blank lines split paragraphs.
 */
export const trickIntros: Record<string, string> = {
  "request-batching":
    "A web page is made of lots of pieces, and every piece needs data. If each piece only asks for its data after the one before it has finished, you wait through every single ask, one after another, like a queue at a very slow bakery. YouTube's web team looked at its watch page and asked a rude question: do we really need all these separate trips?",

  "field-data":
    "Your Lighthouse score says 98. Your users say the page loads like it is being delivered by pigeon. Both can be true, because one is a test on your fast laptop and the other is real people on real phones. YouTube's web team went and looked at the real numbers, and found some watch pages taking 4 to 6 seconds to show their biggest thing.",

  "adaptive-bitrate":
    "A video player is supposed to pick the best quality your internet can handle. But your internet is not the only thing that can choke. A device can also be too weak to play a high resolution smoothly. YouTube noticed its player would cheerfully pick a resolution a device could not handle, and then fixed that. The result is a rare win: fewer stalls, almost no loss in sharpness.",

  "canvas-rendering":
    "Almost every web page you have ever seen is built from HTML elements. Google Docs looked at that and moved to painting the document onto a canvas instead, which is closer to drawing a page than building one. Google said the goal was performance and consistency across platforms. It also came with a bill, and the bill is the interesting bit.",

  webassembly:
    "Figma feels like a desktop app that wandered into a browser tab. Its product is written in C++, which browsers do not speak. So the question was how to run it anyway, and the answer Figma picked made it load more than 3 times faster.",

  "server-rendering-service":
    "Rendering a page on the server sounds easy until you have a big JavaScript app that has to do it. Airbnb's answer was to build a whole separate service whose only job is to turn JavaScript views into an HTML string. They open-sourced it and called it Hypernova, which is a very dramatic name for a thing that returns strings.",

  "service-worker-cache":
    "Installing the Android app version of Twitter meant downloading 23.5MB. The web version, Twitter Lite, was 600KB over the wire. It is a progressive web app, and it uses a service worker, a script that sits between the page and the network, to make moving between screens fast.",

  "atomic-css":
    "Nobody thinks about CSS until the stylesheet is the size of a small novel. When Facebook rebuilt Facebook.com in 2020, it cut the CSS on its homepage by 80 percent. The trick is slightly weird: instead of writing a bunch of styles per component, you generate one tiny class per declaration and reuse it everywhere.",

  "loading-tiers":
    "Not all JavaScript is equally urgent, but a lot of sites ship it all like it is. Facebook split the JavaScript for the initial load into three tiers: what the first paint needs, what it takes to fully render the part you can see, and what can wait until after display. Logging code, for instance, can wait. Nobody has ever been upset that a log line was late.",

  "layered-cache":
    "Wikipedia gets read a lot, and on a normal day over 90% of those read requests are served by its caches, not built fresh. Wikimedia's setup ran two caches on each node: one in RAM, which is fast and small, and one on disk, which is slower and big. Two layers, two bets.",

  "gradual-migration":
    "GitHub pulled in jQuery in late 2007. By 2018 it was a 30 kB dependency the team wanted gone, because browsers had caught up and standard APIs could do what it needed. You cannot just rip a library out of a big codebase on a Friday afternoon. What GitHub did instead is a lesson in patience, plus one very passive-aggressive lint rule.",

  "migrate-live":
    "Moving a database is easy if you are allowed to switch the product off for a week. Nobody is. Notion got its move down to five minutes of scheduled maintenance, and Discord's requirement was no downtime at all. They ended up with the same shape: write to both, copy the old stuff, check everything twice, then flip the switch. It is less glamorous than a rewrite and much harder to get wrong.",

  "hexagon-grid":
    "Riders and drivers are just dots on a map, and \"who is nearby?\" is annoying to answer with dots. Uber's answer was H3, a grid that cuts the Earth into hexagons. Not squares. Hexagons, and there is a good reason, which is the whole trick.",

  "last-writer-wins":
    "When two people edit the same Figma file at the same moment, something has to decide what the file looks like afterwards. The famous answer is operational transforms, the approach popularized by apps like Google Docs. Figma looked at it and decided it was unnecessarily complex for its problem space. So it built something simpler that mostly boils down to this: whoever the server heard last wins.",

  "fractional-indexing":
    "Drag a layer to the top of a long list in Figma. You would think that means renumbering every layer below it. It does not. Figma gives each layer a number, and to slot one between two others it takes the average of the two. One edit, however long the list is.",

  "virtual-list":
    "GitHub's first code view did the obvious thing: draw every line of the file. For one huge file, that meant a 27 second wait. The fix sounds like cheating, which is to only draw the lines you can actually see. It is not a free lunch, though, and the catch is the good part.",

  "local-first-navigation":
    "Some of the time, you click an issue on GitHub and it just opens. That is not because the server got faster. It is because GitHub stopped waiting for it: it shows what it already has saved in your browser, then checks with the server in the background.",

  "prefetch-before-click":
    "A click is slow for one reason: nothing started until you did it. Facebook's rebuilt site cheats. It begins loading the next page when you hover over a link or focus it, before you click. By the time you have made up your mind, the page is already on its way.",

  "request-coalescing":
    "Picture a popular Wikipedia page that is not in the cache right now, and a thousand people ask for it in the same second. A naive cache says \"nope, not here\" a thousand times and sends a thousand requests to the servers that build the page. That is a cache stampede. Wikimedia's fix is to be less dumb about it: send one request, and make everyone else wait.",

  "consistent-hashing":
    "Say you have a bunch of servers and a pile of work, and each piece of work should always go to the same server. The obvious way breaks the moment a server joins or dies, because suddenly almost everything has to move. Uber, Cloudflare and Wikimedia all use hashing like this to avoid that. Cloudflare used a ring to send each request to a server that already had the code loaded, and its cold start rate went from 0.1% to 0.01%.",

  "cache-vs-gc":
    "Discord had a Go service that was fast most of the time, and then roughly every two minutes, bang, a latency spike. The culprit was not what you would guess. It was the cache, or more exactly the garbage collector having to scan the whole thing. Discord's eventual fix was rewriting the service in Rust, which is the nuclear option, and it worked.",

  "hot-partition":
    "Discord splits its messages up by channel. Sounds fine, until you remember that a small group of friends and a server with hundreds of thousands of people are not remotely the same size. Discord found that one very busy channel could slow down its whole database cluster, and moving to a new database did not make the problem go away.",

  "partition-key":
    "Notion is a notes app where every page is built from small pieces called blocks. At some point it had to split its data across many databases. The question sounds boring: which rows go on which machine? Get it wrong and every page you open has to ask every machine for its pieces. Notion's answer is simple, and it only works because of one fact about how people use the app.",

  "idempotency-keys":
    "You click Pay. The spinner spins, the Wi-Fi blinks, and the page says it failed. Did the card get charged? Neither you nor the code knows. Stripe's answer is that the client should be allowed to just try again, and the server should make sure trying again changes nothing. That takes one made-up ID and some manners.",

  "rate-limiting":
    "If you run an API, someone will eventually send it far too many requests, usually by accident, with a script that got out of hand. Stripe's answer is not one limiter but four, and the last one only wakes up when things are already going wrong. Two of them look at the user. The other two look at the health of the whole system.",

  "ngram-index":
    "Why not just use grep? GitHub gets asked this a lot, so it did the napkin math, and the answer is a number of cores and a number of seconds that nobody wants to put on an infrastructure bill. The fix is a classic: do the work ahead of time. The twist is that the thing you index is not words. It is every short slice of every file, three letters long in GitHub's example.",

  "ownership-reasons":
    "Notion lets you keep pages available offline. That is simple until a page can be offline for more than one reason: you switched it on, it was downloaded automatically, or its parent page is offline. Notion's first design, a plain set of pages to keep, broke right there. Switch off one reason and the page gets removed, even though something else still needs it.",
};
