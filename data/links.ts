/**
 * Where new engineering tricks come from: the blogs the stories here already quote, more company blogs worth
 * following, the browser and framework teams, and a few reading lists. Shown on /links.
 *
 * Every link was fetched and loads, and each blog's feed was read to see how often it posts (both checked 2026-11-09). The company and browser blogs are first-party: the
 * same kind of source this site quotes. The reading lists at the end are third-party and say so; use them to
 * find more, not as sources. The descriptions only say what the page itself says it is, or which posts on this
 * site came from it. No em dashes.
 */
export interface LinkItem {
  name: string;
  href: string;
  desc: string;
}

export interface LinkGroup {
  id: string;
  title: string;
  blurb: string;
  items: LinkItem[];
}

export const linkGroups: LinkGroup[] = [
  {
    id: "quoted",
    title: "Blogs this site already quotes",
    blurb: "New posts from the companies behind the stories and tricks here.",
    items: [
      { name: "Engineering at Meta", href: "https://engineering.fb.com/", desc: "Posts from Meta's engineers. The Facebook story here comes from its 2020 rebuild post." },
      { name: "Discord", href: "https://discord.com/category/engineering", desc: "Discord's engineering posts, including the Read States and message storage ones used here." },
      { name: "Notion", href: "https://www.notion.com/blog/topic/tech", desc: "Notion's tech posts, including the sharding and offline mode ones used here." },
      { name: "Figma", href: "https://www.figma.com/blog/engineering/", desc: "Figma's engineering posts: multiplayer, WebAssembly and ordered sequences are used here." },
      { name: "Cloudflare", href: "https://blog.cloudflare.com/", desc: "Cloudflare's blog. The Workers cold start post used here is on it." },
      { name: "GitHub Engineering", href: "https://github.blog/engineering/", desc: "The latest from GitHub's engineering team, including the code view and Issues posts used here." },
      { name: "Uber Engineering", href: "https://www.uber.com/blog/engineering/", desc: "Uber's engineering blog. The H3 and Ringpop posts used here are from it." },
      { name: "Wikimedia Diff: technology", href: "https://diff.wikimedia.org/category/technology/", desc: "Wikimedia's technology posts. Its CDN series is used in the Wikipedia story here." },
      { name: "Stripe", href: "https://stripe.com/blog/engineering", desc: "Stripe's engineering blog. Its post on online migrations is linked from the migration trick." },
    ],
  },
  {
    id: "more",
    title: "More company engineering blogs",
    blurb: "Worth following. Nothing from these is on the site yet.",
    items: [
      { name: "Netflix TechBlog", href: "https://netflixtechblog.com/", desc: "Netflix's engineering blog, hosted on Medium." },
      { name: "Airbnb Engineering", href: "https://airbnb.tech/", desc: "Airbnb's engineering and data science blog." },
      { name: "Shopify Engineering", href: "https://shopify.engineering/", desc: "Shopify's engineering blog." },
      { name: "Dropbox Tech", href: "https://dropbox.tech/", desc: "Dropbox's tech blog." },
      { name: "Slack Engineering", href: "https://slack.engineering/", desc: "Engineering at Slack." },
      { name: "LinkedIn Engineering", href: "https://www.linkedin.com/blog/engineering", desc: "LinkedIn's engineering blog." },
      { name: "Spotify Engineering", href: "https://engineering.atspotify.com/", desc: "Spotify's official technology blog." },
      { name: "Pinterest Engineering", href: "https://medium.com/pinterest-engineering", desc: "Pinterest's engineering blog, hosted on Medium." },
      { name: "Vercel", href: "https://vercel.com/blog", desc: "Vercel's blog, from the team behind Next.js." },
      { name: "Amazon Builders' Library", href: "https://aws.amazon.com/builders-library/", desc: "Articles by Amazon engineers on how Amazon builds and runs large systems." },
    ],
  },
  {
    id: "platform",
    title: "Browsers, frameworks and languages",
    blurb: "Where the platform itself changes, from the teams that build it.",
    items: [
      { name: "web.dev blog", href: "https://web.dev/blog", desc: "Google's web platform and performance articles. The YouTube and Twitter case studies used here are from web.dev." },
      { name: "Chrome for Developers", href: "https://developer.chrome.com/blog", desc: "What is new in Chrome and the web platform." },
      { name: "Mozilla Hacks", href: "https://hacks.mozilla.org/", desc: "The web developer blog from Mozilla." },
      { name: "WebKit blog", href: "https://webkit.org/blog/", desc: "News from WebKit, the engine behind Safari." },
      { name: "MDN Blog", href: "https://developer.mozilla.org/en-US/blog/", desc: "MDN's own blog." },
      { name: "React blog", href: "https://react.dev/blog", desc: "Release notes and design posts from the React team." },
      { name: "Next.js blog", href: "https://nextjs.org/blog", desc: "Releases and ideas from the Next.js team." },
      { name: "V8 blog", href: "https://v8.dev/blog", desc: "How V8, the JavaScript engine in Chrome, works and changes. Posts have been rare lately." },
      { name: "The Go blog", href: "https://go.dev/blog/", desc: "Posts from the Go team." },
    ],
  },
  {
    id: "lists",
    title: "Reading lists and newsletters",
    blurb: "Third-party. Good for finding more, but not sources: this site only quotes the companies themselves.",
    items: [
      { name: "engineering-blogs", href: "https://github.com/kilimchoi/engineering-blogs", desc: "A curated list of engineering blogs, kept by the community on GitHub." },
      { name: "awesome-scalability", href: "https://github.com/binhnguyennus/awesome-scalability", desc: "A community list of articles on the patterns of scalable, reliable and performant systems." },
      { name: "Hacker News", href: "https://news.ycombinator.com/", desc: "Where new engineering posts often get discussed." },
      { name: "InfoQ", href: "https://www.infoq.com/", desc: "News, articles and talks on software development and architecture." },
      { name: "Frontend Focus", href: "https://frontendfoc.us/", desc: "A newsletter for front-end developers." },
      { name: "Web Performance Calendar", href: "https://calendar.perfplanet.com/", desc: "An annual advent calendar of web performance articles." },
      { name: "High Scalability", href: "https://highscalability.com/", desc: "A long-running archive of scalability write-ups. Mostly an archive now: its newest posts are a few years old." },
    ],
  },
];
