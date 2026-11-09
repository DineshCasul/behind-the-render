/**
 * Small outline shapes in the margins of a long page, spread evenly down it and alternating sides. As each
 * one scrolls into view it draws itself, and it turns and drifts a little as it passes (see "Scroll
 * drawings" in app/globals.css). Hairline strokes, grey, no fill. Hidden on screens too narrow for
 * margins. A server component: it is only markup; the motion is CSS. It must sit inside a `relative` parent.
 *
 * Every path has pathLength="1", so the draw-in animation can treat each one as length 1.
 * The shapes and their order come from a seed (a page's slug), so each page keeps its own.
 */
export const SHAPES = {
  // An isometric cube.
  cube: ["M50 4 L90 27 L90 73 L50 96 L10 73 L10 27 Z", "M50 28 L70 39 L70 61 L50 72 L30 61 L30 39 Z", "M50 4 L50 28", "M90 73 L70 61", "M10 73 L30 61"],
  // A ring with four ticks.
  ring: [
    "M6 50 A44 44 0 1 1 94 50 A44 44 0 1 1 6 50 Z",
    "M28 50 A22 22 0 1 1 72 50 A22 22 0 1 1 28 50 Z",
    "M50 6 L50 16",
    "M50 84 L50 94",
    "M6 50 L16 50",
    "M84 50 L94 50",
  ],
  // Two nested diamonds.
  diamond: ["M50 6 L94 50 L50 94 L6 50 Z", "M50 28 L72 50 L50 72 L28 50 Z", "M50 6 L50 28", "M94 50 L72 50", "M50 94 L50 72", "M6 50 L28 50"],
  // Two nested triangles.
  triangle: ["M50 8 L92 88 L8 88 Z", "M50 42 L72 80 L28 80 Z", "M50 8 L50 42", "M92 88 L72 80", "M8 88 L28 80"],
  // Two nested squares, one turned.
  square: ["M14 14 L86 14 L86 86 L14 86 Z", "M50 4 L96 50 L50 96 L4 50 Z", "M32 32 L68 32 L68 68 L32 68 Z"],
  // A plus inside a circle.
  plus: ["M6 50 A44 44 0 1 1 94 50 A44 44 0 1 1 6 50 Z", "M50 20 L50 80", "M20 50 L80 50"],
  // A flat hexagon with a smaller one inside.
  hexagon: ["M27 8 L73 8 L96 50 L73 92 L27 92 L4 50 Z", "M38 29 L62 29 L73 50 L62 71 L38 71 L27 50 Z", "M27 8 L38 29", "M96 50 L73 50", "M27 92 L38 71"],
  // A square spiral, one line.
  spiral: ["M50 50 L50 38 L62 38 L62 62 L38 62 L38 26 L74 26 L74 74 L26 74 L26 14 L86 14"],
  // Three waves.
  waves: ["M4 28 C 20 8, 34 8, 50 28 S 80 48, 96 28", "M4 50 C 20 30, 34 30, 50 50 S 80 70, 96 50", "M4 72 C 20 52, 34 52, 50 72 S 80 92, 96 72"],
  // Three chevrons.
  chevrons: ["M18 18 L50 44 L82 18", "M18 44 L50 70 L82 44", "M18 70 L50 96 L82 70"],
  // A three-by-three grid.
  grid: ["M6 6 L94 6 L94 94 L6 94 Z", "M35 6 L35 94", "M65 6 L65 94", "M6 35 L94 35", "M6 65 L94 65"],
  // An asterisk with a small circle at its centre.
  asterisk: ["M50 6 L50 94", "M6 50 L94 50", "M19 19 L81 81", "M81 19 L19 81", "M60 50 A10 10 0 1 1 40 50 A10 10 0 1 1 60 50 Z"],
  // Two square brackets with a dash between.
  brackets: ["M32 8 L10 8 L10 92 L32 92", "M68 8 L90 8 L90 92 L68 92", "M40 50 L60 50"],
} as const;

type ShapeKind = keyof typeof SHAPES;
export const KINDS = Object.keys(SHAPES) as ShapeKind[];

/** Sizes in pixels, cycled through, so neighbouring shapes differ. Kept small so they fit the margins. */
const SIZES = [72, 56, 76, 64, 58, 70, 60, 74, 62] as const;

/** A number from a seed, so a page always gets the same shapes in the same order. */
export function hash(seed: string): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/** Pages whose subject has an obvious shape start with it. */
const FIRST: Record<string, ShapeKind> = { "hexagon-grid": "hexagon", "consistent-hashing": "ring" };

/** Walking the list in steps of 5 keeps neighbours different; 5 shares no factor with 13 shapes, so every shape gets used before one repeats. */
const STRIDE = 5;

export function MarginShapes({ seed, count = 6 }: { seed: string; count?: number }) {
  const h = hash(seed);
  const start = FIRST[seed] ? KINDS.indexOf(FIRST[seed]) : h % KINDS.length;
  return (
    <div className="margin-shapes" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const paths = SHAPES[KINDS[(start + i * STRIDE) % KINDS.length]];
        // Spread down the page from 5% to 93%, with a small shift per page so two pages do not line up.
        const top = 5 + (count === 1 ? 0 : (i * 88) / (count - 1)) + ((h >> (i % 7)) % 5) - 2;
        return (
          <div
            key={i}
            className={`margin-shape ${i % 2 === 0 ? "is-right" : "is-left"}`}
            style={{ top: `${Math.max(2, Math.min(94, top)).toFixed(1)}%`, ["--s" as string]: SIZES[i % SIZES.length] }}
          >
            <svg viewBox="0 0 100 100" focusable="false">
              {paths.map((d) => (
                <path key={d} d={d} pathLength={1} />
              ))}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
