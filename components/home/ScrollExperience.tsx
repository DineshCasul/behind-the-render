"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Hero } from "@/components/ui/Hero";
import { HeroPhone } from "@/components/ui/HeroPhone";
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
  const reduceMotion = useReducedMotion();

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

  // Arriving from a lesson's "Back to map" link (`/?to=map`): start at the
  // very top so the hero is seen, then glide down through the pinned scene
  // to the map. Driven by Framer's `animate()` calling window.scrollTo each
  // frame (not native smooth scroll) so the duration is ours to control;
  // any wheel/touch/key input cancels it so we never fight the user.
  useEffect(() => {
    if (reduceMotion === null) return; // media query not resolved yet
    const params = new URLSearchParams(window.location.search);
    if (params.get("to") !== "map") return;
    window.scrollTo(0, 0);

    // On phones there is no pinned scene (the phone layout is hero, then the
    // portrait map in normal flow), so just scroll the map into view.
    const isWide = window.matchMedia("(min-width: 1024px)").matches;
    if (!isWide) {
      const timer = setTimeout(() => {
        window.history.replaceState(null, "", "/");
        document.getElementById("map-mobile")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }, 500);
      return () => clearTimeout(timer);
    }

    // The param is only stripped once we actually act on it (below), React
    // StrictMode runs effects twice in dev, and consuming it up front would
    // leave the second run with nothing to do.
    if (reduceMotion) {
      window.history.replaceState(null, "", "/");
      document.getElementById("map")?.scrollIntoView();
      return;
    }

    let controls: ReturnType<typeof animate> | null = null;
    const cancel = () => controls?.stop();
    const start = setTimeout(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      window.history.replaceState(null, "", "/");
      const target = scene.offsetTop + scene.offsetHeight - window.innerHeight;
      controls = animate(0, target, {
        duration: 3,
        ease: [0.45, 0, 0.25, 1],
        onUpdate: (y) => window.scrollTo(0, y),
      });
      window.addEventListener("wheel", cancel, { once: true, passive: true });
      window.addEventListener("touchstart", cancel, { once: true, passive: true });
      window.addEventListener("keydown", cancel, { once: true });
    }, 700);

    return () => {
      clearTimeout(start);
      cancel();
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [reduceMotion]);

  // Phones and tablets (< lg, 1024px): hero, then the portrait map, in normal flow. The pinned
  // scroll scene needs a wide, short viewport; on a phone the map is tall and
  // meant to be scrolled through. Both layouts are in the HTML and CSS picks
  // one (no JavaScript branch), so there's no hydration mismatch or flash.
  const phoneLayout = (
    <div className="lg:hidden">
      <HeroPhone />
      <LearningMap layout="tall" />
    </div>
  );

  if (reduceMotion) {
    // No scroll-jacked scene for reduced-motion users: just the hero,
    // then the map, in normal document flow, nothing pinned, nothing
    // scaled or faded on scroll.
    return (
      <>
        <div className="hidden lg:block">
          <Hero />
          <LearningMap expanded={false} />
        </div>
        {phoneLayout}
      </>
    );
  }

  return (
    <>
      <div ref={sceneRef} style={{ height: `${SCENE_HEIGHT_VH}vh` }} className="relative hidden lg:block">
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
          </motion.div>
        </div>
      </div>
      {phoneLayout}
    </>
  );
}
