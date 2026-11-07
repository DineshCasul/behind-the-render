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
  hue: string;
}

export const ROAD_KINDS = [
  { id: "start", title: "Start here", blurb: "One click, followed from your finger to the screen.", hue: "#ff8a5c" },
  { id: "feeds", title: "Feeds and video", blurb: "Sites people open all day, on bad networks and old phones.", hue: "#ff5252" },
  { id: "knowledge", title: "Reading, writing and code", blurb: "Pages that millions read and a few edit.", hue: "#4ee3a0" },
  { id: "tools", title: "Maps, design and stays", blurb: "Apps that behave like software, not like pages.", hue: "#c58bff" },
] as const satisfies readonly Group[];

export const TRICK_GROUPS = [
  { id: "faster", title: "Load faster", blurb: "Get something on the screen sooner.", hue: "#ffd24a" },
  { id: "scale", title: "Survive the crowd", blurb: "Serve millions without melting.", hue: "#5aa9ff" },
  { id: "native", title: "Feel like an app", blurb: "Do what the page was never meant to do.", hue: "#c58bff" },
  { id: "change", title: "Change it safely", blurb: "Replace the engine while the plane is flying.", hue: "#4ee3a0" },
] as const satisfies readonly Group[];

export type RoadKind = (typeof ROAD_KINDS)[number]["id"];
export type TrickGroup = (typeof TRICK_GROUPS)[number]["id"];
