/**
 * The groups that roads and tricks are filed under. The groups are fixed and
 * few; the content is not. Each road says which kind it is (`kind` in
 * data/journey.ts) and each trick says which group it is (`group` in
 * data/tricks.ts), so adding a site or a trick never means editing this file,
 * and a group with nothing in it simply doesn't show.
 *
 * Groups are by the question a visitor is likely to have, not by technology:
 * "what sort of site?" for roads, "what problem does it solve?" for tricks.
 */
export interface Group {
  id: string;
  title: string;
  blurb: string;
}

export const ROAD_KINDS = [
  { id: "feeds", title: "Feeds and video", blurb: "Sites people open all day, on bad networks and old phones." },
  { id: "knowledge", title: "Reading, writing and code", blurb: "Pages that millions read and a few edit." },
  { id: "tools", title: "Maps, design and stays", blurb: "Apps that behave like software, not like pages." },
  { id: "backend", title: "Behind the page", blurb: "Databases, caches and servers, where the interesting trade-offs live." },
] as const satisfies readonly Group[];

export const TRICK_GROUPS = [
  { id: "faster", title: "Load faster", blurb: "Get something on the screen sooner." },
  { id: "scale", title: "Survive the crowd", blurb: "Serve millions without melting." },
  { id: "native", title: "Feel like an app", blurb: "Do what the page was never meant to do." },
  { id: "change", title: "Change it safely", blurb: "Replace the engine while the plane is flying." },
  { id: "sync", title: "Stay in sync", blurb: "Many people, one document, and no one waiting." },
] as const satisfies readonly Group[];

export type RoadKind = (typeof ROAD_KINDS)[number]["id"];
export type TrickGroup = (typeof TRICK_GROUPS)[number]["id"];
