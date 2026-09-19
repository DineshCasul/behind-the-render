import type { ConceptId, InterviewQuestion } from "@/lib/types";

export const storyConceptQuestions: Partial<Record<ConceptId, InterviewQuestion[]>> = {
  "js-main-thread": [
    {
      "category": "fundamentals",
      "question": "What work shares the browser's main thread with your JavaScript?",
      "answer": "Style calculation, layout, most painting and input handling all run on the same main thread as your scripts.",
      "reasoning": "That sharing is the whole problem: any script that runs for a long time delays all of those, which is what the visitor experiences as a frozen page.",
      "followUp": "Which parts of rendering can happen off the main thread?"
    },
    {
      "category": "tricky",
      "question": "A function is marked async and awaits a fetch. Does it block the main thread while waiting?",
      "answer": "No. While the promise is pending, other tasks can run. But the synchronous code before and after the await still runs on the main thread, and if it does heavy work it blocks like any other code.",
      "reasoning": "`async` changes when code resumes, not where it runs. It never moves computation to another thread.",
      "example": "An `async` function that sorts a million items after `await` blocks input for the whole sort.",
      "followUp": "How would you move that sort off the main thread?"
    },
    {
      "category": "scenario",
      "question": "A search box freezes for half a second on each keystroke because it filters 20,000 rows. What are your options?",
      "answer": "Mark the filtering update as a transition or defer the value so typing stays responsive, virtualize the list so fewer rows render, debounce the filtering, or move the filtering into a Web Worker.",
      "reasoning": "The cost is a long task triggered by input. You can make React treat it as interruptible, do less of it, or do it somewhere else.",
      "followUp": "Which option would you try first, and how would you measure that it worked?"
    },
    {
      "category": "senior",
      "question": "Why can shipping less JavaScript improve responsiveness even if download speed is not the bottleneck?",
      "answer": "Because every byte of JavaScript has to be parsed, compiled and executed on the main thread of the visitor's device, and hydrating components adds more. That work competes with input handling regardless of how quickly the file arrived.",
      "reasoning": "This separates network cost from CPU cost. On a mid-range phone the CPU cost is often the larger one.",
      "followUp": "How do Server Components change the amount of main-thread work?"
    },
    {
      "category": "debugging",
      "question": "DevTools shows a 400 ms task in your click handler. How do you find what is slow?",
      "answer": "Record a Performance profile, find the long task, and read its flame chart to see which functions dominate. Then break the work up, yield between pieces, or remove it. The Long Animation Frames API can attribute slow frames in production.",
      "reasoning": "The profile tells you which function, not just that the page is slow, so you fix the real cost instead of guessing.",
      "followUp": "How would you catch the same problem happening for real users?"
    }
  ],
  "seo": [
    {
      "category": "fundamentals",
      "question": "What does a crawler receive from a client-rendered page on its first request?",
      "answer": "The app shell: an almost empty HTML document plus script tags. The real content only exists after JavaScript runs.",
      "reasoning": "Crawling and rendering are separate steps, so the content is only visible to the crawler once the page has been rendered, which happens later and is not guaranteed to happen at all.",
      "followUp": "What would the same crawler receive from a statically generated page?"
    },
    {
      "category": "tricky",
      "question": "Google renders JavaScript. Why is a client-rendered page still riskier for search?",
      "answer": "Because rendering is a separate queued step after crawling, so content that depends on it is seen later, and it depends on the JavaScript running successfully for the crawler. Other crawlers may not run JavaScript at all.",
      "reasoning": "\"Can render\" doesn't mean \"renders immediately and every time\". Removing the dependency on rendering removes the risk.",
      "followUp": "Which parts of your page matter most to have in the initial HTML?"
    },
    {
      "category": "scenario",
      "question": "A marketing site was rewritten as a client-rendered app and organic traffic dropped. What do you check first?",
      "answer": "View the raw HTML response (not the DevTools DOM) to see whether the content and links are in it, check status codes and titles, and look at how the pages appear in the search console's URL inspection. Then move the public pages to static or server rendering.",
      "reasoning": "View Source shows what a crawler gets first. If the content isn't there, you have found the gap.",
      "followUp": "Which rendering strategy would you pick for a blog with 5,000 posts, and why?"
    },
    {
      "category": "senior",
      "question": "When is dynamic rendering (serving crawlers a pre-rendered version) justified?",
      "answer": "Rarely: Google describes it as a workaround, not a recommended solution, because it adds complexity and resource needs. It can be a stop-gap for a legacy client-rendered app that can't be migrated yet, but new work should use SSR or SSG.",
      "reasoning": "Two versions of a page means two things that can drift apart, and you now own the reliability of both.",
      "followUp": "How would you verify the two versions stay equivalent?"
    },
    {
      "category": "debugging",
      "question": "A page looks perfect in the browser but Google's inspection shows missing content. Why might that be?",
      "answer": "The content probably arrives via a client-side request that the crawler didn't wait for, was blocked (robots rules, an auth-only API), or failed during rendering. Compare the raw HTML, the rendered HTML and the network calls.",
      "reasoning": "Your browser has cookies, cache and time. A crawler has none of those, so anything the content depends on has to be available to it too.",
      "followUp": "How would you make that content available in the initial response?"
    }
  ],
  "web-vitals": [
    {
      "category": "fundamentals",
      "question": "What do LCP, INP and CLS each measure?",
      "answer": "LCP measures when the main content appears, INP measures how quickly the page responds to interactions, and CLS measures how much the layout shifts unexpectedly.",
      "reasoning": "Loading, responsiveness and visual stability are three separate things a visitor notices, so each gets its own number.",
      "followUp": "What is a good target for each, and at which percentile is it judged?"
    },
    {
      "category": "tricky",
      "question": "Why is INP a better measure of responsiveness than First Input Delay was?",
      "answer": "FID only measured the delay before the first interaction was handled. INP looks at all interactions across the visit and includes the time until the next paint, so it reflects the whole experience, not one moment.",
      "reasoning": "A page can respond well to the first tap and badly to every later one, which FID could never show.",
      "followUp": "Which parts of an interaction make up INP?"
    },
    {
      "category": "scenario",
      "question": "Your Lighthouse score is 98 but users complain the page feels slow. What do you check?",
      "answer": "Field data: the Chrome UX Report or your own reporting via the `web-vitals` library, split by device and connection. Lab runs use a fast simulated environment, so real users on slow phones may be far worse, especially for INP.",
      "reasoning": "The complaint is about real experience, so the evidence has to come from real users.",
      "followUp": "How would you collect that data without a third-party service?"
    },
    {
      "category": "senior",
      "question": "You move a page from client rendering to server rendering. Which vitals would you expect to improve, and which might get worse?",
      "answer": "LCP usually improves because content arrives in the first response. TTFB can get worse (the server now does work before responding), and INP can be unchanged or worse until hydration finishes, since the page looks ready before it responds.",
      "reasoning": "Moving work changes where the wait happens rather than deleting it. Each metric catches a different part of that trade.",
      "followUp": "What would you change to protect INP after the move?"
    },
    {
      "category": "debugging",
      "question": "CLS is high on one page only. How do you find the cause?",
      "answer": "Record a Performance profile or use the Layout Shift regions in DevTools to see which elements move and when. The usual causes are images or embeds without reserved dimensions, late-loading ads or fonts, and content inserted above what the visitor is reading.",
      "reasoning": "Shifts are caused by specific elements resizing or arriving late, and DevTools can point at them.",
      "followUp": "How would you prevent that class of shift for good?"
    }
  ],
  "client-components": [
    {
      "category": "fundamentals",
      "question": "What does the `\"use client\"` directive actually mark?",
      "answer": "The module it's in, and everything that module imports, as code that ships to and runs in the browser. It is a boundary between server and client code, not a label on a single component.",
      "reasoning": "That is why one directive can pull a lot of code into the client bundle.",
      "followUp": "What happens to a component that is imported by a `\"use client\"` file but doesn't have the directive itself?"
    },
    {
      "category": "tricky",
      "question": "Are Client Components rendered only in the browser?",
      "answer": "No. They are pre-rendered to HTML on the server for the first load and then hydrated in the browser, where they continue to run.",
      "reasoning": "\"Client\" is about where the code ships and keeps running, so the first paint doesn't have to wait for it.",
      "followUp": "Which browser-only APIs are unsafe to call during that first server render?"
    },
    {
      "category": "scenario",
      "question": "A page is a Server Component, but one small like button needs state. Where do you put the boundary?",
      "answer": "Extract the button into its own file with `\"use client\"` and import it into the server page. The page and everything around the button stay on the server, and only the button's code ships to the browser.",
      "reasoning": "The smaller the client component, the less JavaScript there is to download and hydrate.",
      "followUp": "What if the button needs data that only the server has?"
    },
    {
      "category": "senior",
      "question": "A team marks the root layout `\"use client\"` because one widget needed state. What is the cost?",
      "answer": "Everything the layout imports becomes client code, so most of the app ships to the browser and hydrates, which erases the bundle and hydration savings of Server Components. The fix is to move the directive down to the widget.",
      "reasoning": "The directive is inherited through imports, so the higher it sits, the more of the app it captures.",
      "followUp": "How would you find out which modules ended up in the client bundle?"
    },
    {
      "category": "debugging",
      "question": "You get \"Functions cannot be passed directly to Client Components\". What is happening?",
      "answer": "A Server Component is passing a function as a prop across the server-client boundary. Props there must be serializable, and functions aren't. Move the logic into the Client Component, or use a Server Function where appropriate.",
      "reasoning": "The props are serialized to travel from server to browser, and a function has no serialized form.",
      "followUp": "Which prop types are safe to pass across the boundary?"
    }
  ]
};
