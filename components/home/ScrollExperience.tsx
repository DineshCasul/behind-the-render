"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { scrollToMap } from "@/lib/scroll-to-map";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { Hero } from "@/components/ui/Hero";
import { HeroPhone } from "@/components/ui/HeroPhone";
import { MapHeading } from "@/components/home/MapHeading";
import { LearningMap } from "@/components/learning-map/LearningMap";

// How much scroll distance the whole scene takes to play out, in viewport
// heights. Bigger = more room to scrub through before it releases.
const SCENE_HEIGHT_VH = 240;

/**
 * A pinned, scroll-scrubbed scene: the hero recedes and fades like a
 * camera pulling back, and the map emerges from depth, small, tilted,
 * faded, and settles flat, filling the entire viewport. Not a simple
 * fade: the map is genuinely 100vw x 100vh at the end of this, not just
 * "wide," because the whole scene is pinned (`position: sticky`) while
 * the user scrolls through it.
 *
 * Why sticky + a tall wrapper, instead of `position: fixed`: a fixed
 * element ignores scroll entirely, so there'd be no scroll distance to
 * derive animation progress from without also hand-rolling scroll
 * capture/prevention (bad for accessibility and trackpad/touch feel).
 * `position: sticky` on a viewport-height child inside a much taller
 * (240vh) parent gets the same *visual* pin for free, the browser holds
 * the child in place for exactly as long as its tall parent is being
 * scrolled through, while scroll itself stays completely native.
 */
export function ScrollExperience() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  // Hero: recedes toward the viewer and fades out early in the scene,
  // out of the way well before the map needs the space. Only transform and
  // opacity: a per-frame `filter: blur()` was tried first and made the
  // scroll stutter, since every frame re-blurred a large text layer.
  // Every range below runs the full 0 to 1 (with the value held flat at the ends).
  // Chrome/Edge run scroll-linked animations natively, and when the last keyframe
  // isn't at 100% the browser invents one there from the element's original
  // value: the hero used to fade back IN and the map back OUT at the end of the
  // scene, a triangle wave. (Firefox takes the JavaScript path, so it never showed.)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.32, 1], [1, 0, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.32, 1], [1, 1.2, 1.2]);

  // Map: starts small, tilted back in 3D space and transparent, then
  // scales up and flattens out (rotateX -> 0) as if swinging up into
  // view, a "camera dolly" effect, all on `transform`/`opacity`/`filter`
  // so it stays compositor-only (see learning-notes/06).
  const mapOpacity = useTransform(scrollYProgress, [0, 0.18, 0.5, 1], [0, 0, 1, 1]);
  const mapScale = useTransform(scrollYProgress, [0, 0.18, 1], [0.78, 0.78, 1]);
  // The map layer sits on top of the hero in the DOM, so while it is still
  // invisible it must not swallow clicks meant for the hero's buttons.
  const mapPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.18 ? "none" : "auto"));
  const mapRotateX = useTransform(scrollYProgress, [0, 0.18, 0.75, 1], [14, 14, 0, 0]);

  // Phones and tablets (< lg, 1024px): hero, then the portrait map, in normal flow. The pinned
  // scroll scene needs a wide, short viewport; on a phone the map is tall and
  // meant to be scrolled through. Both layouts are in the HTML and CSS picks
  // one (no JavaScript branch), so there's no hydration mismatch or flash.
  const phoneLayout = (
    <div className="lg:hidden">
      <HeroPhone />
      <MapHeading withQuestionsLink className="px-6 pb-3 pt-10 text-center" />
      <LearningMap layout="tall" />
    </div>
  );

  // Arriving from the story's "Or explore every concept" button (`/?to=map`):
  // scroll down to the map, once. Any other visit stays at the top. The param
  // is stripped when we act on it (not before: StrictMode runs effects twice
  // in dev, and the second run must still see it).
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("to") !== "map") return;
    const timer = setTimeout(() => {
      window.history.replaceState(null, "", "/");
      scrollToMap(reduceMotion);
    }, 500);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  if (reduceMotion) {
    // No scroll-jacked scene for reduced-motion users: just the hero,
    // then the map, in normal document flow, nothing pinned, nothing
    // scaled or faded on scroll.
    return (
      <>
        {/* useScroll above still targets sceneRef; after the switch from the
            pinned scene to this layout the ref must keep pointing at a real
            element, or Framer throws "Target ref is defined but not hydrated". */}
        <div ref={sceneRef} hidden />
        <div className="hidden lg:block">
          <Hero />
          <MapHeading withQuestionsLink className="px-8 pb-3 pt-10 text-center" />
          <LearningMap expanded={false} />
        </div>
        {phoneLayout}
      </>
    );
  }

  return (
    <>
      <div id="home-scene" ref={sceneRef} style={{ height: `${SCENE_HEIGHT_VH}vh` }} className="relative hidden lg:block">
        <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ perspective: 1200 }}>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: heroOpacity, scale: heroScale, willChange: "transform, opacity" }}
          >
            <Hero />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            style={{
              opacity: mapOpacity,
              pointerEvents: mapPointerEvents,
              scale: mapScale,
              rotateX: mapRotateX,
              transformPerspective: 1200,
              willChange: "transform, opacity",
            }}
          >
            {/*
              Full-bleed from the very first frame. This used to flip from a
              padded "card" to full-bleed at 55% scroll, resizing the map's
              width, padding and corners (with a CSS transition) *while the
              user was scrolling*: a layout change on every frame of that
              transition, which read as jitter.
            */}
            <LearningMap expanded />
            <MapHeading className="pointer-events-none absolute left-6 top-6 z-10" />
          </motion.div>
        </div>
      </div>
      {phoneLayout}
    </>
  );
}
