/**
 * Scrolls the home page down to the map. Shared by the hero's "Explore the map"
 * cue and the `/?to=map` arrival (the story's "Or explore every concept"
 * button), so both go to the same place.
 *
 * Three layouts to target: on phones the map sits below the hero in normal
 * flow (#map-mobile); on desktop the hero is inside a pinned scroll scene, so
 * "the map" means the end of that scene (#home-scene); in the reduced-motion
 * desktop layout there is no scene, so #map is scrolled to.
 */
export function scrollToMap(reduceMotion: boolean) {
  const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
  const wide = window.matchMedia("(min-width: 1024px)").matches;
  if (!wide) {
    document.getElementById("map-mobile")?.scrollIntoView({ behavior, block: "start" });
    return;
  }
  const scene = document.getElementById("home-scene");
  if (scene) {
    window.scrollTo({ top: scene.offsetTop + scene.offsetHeight - window.innerHeight, behavior });
  } else {
    document.getElementById("map")?.scrollIntoView({ behavior, block: "start" });
  }
}
