/**
 * Each road carries its own accent colour (`hue` in data/journey.ts), so each
 * site feels like its own place. A page sets it as `--state-learning` on its
 * root element; every button, glow and eyebrow below it reads that variable,
 * so nothing else needs to know. This file holds only the default and the
 * helper, so client components can use it without pulling in the journey data.
 */
export const DEFAULT_HUE = "#ff8a5c";

/** The style object that recolours a subtree. */
export function hueStyle(hue: string | undefined): React.CSSProperties {
  return { ["--state-learning" as string]: hue ?? DEFAULT_HUE };
}
