import { Frame, HArrow, MONO, T } from "@/components/journey/visual-frame";

/**
 * More journey diagrams: YouTube, Facebook, GitHub and Figma. Same rules as
 * ChapterVisual.tsx: `step` is the index of the subtitle the reader is on, only
 * numbers from the sources appear, and everything animates with opacity or
 * transform. Where a drawing is only a shape (a curve that flattens, bars in a
 * ratio) the caption says what the source says in words.
 */

const label = (size = 9) => ({ ...MONO, fontSize: size });

// ---- YouTube: the slow paint ----

export function LcpTimeline({ step }: { step: number }) {
  const x = (s: number) => 30 + s * (280 / 6);
  const caption =
    step === 0
      ? "Largest Contentful Paint was clocking in at 4 to 6 seconds in some cases."
      : step === 1
        ? "Four to six seconds of staring at a watch page, in some cases."
        : "What to show while the video loads? A solid black poster image showed the best results in user studies.";

  return (
    <Frame title="YouTube: the slow paint" caption={caption}>
      <text x={30} y={26} fill="var(--color-text-muted)" style={label()}>
        LCP on some mobile watch pages
      </text>
      <rect x={30} y={36} width={x(4) - 30} height={18} rx={3} fill="var(--state-revisit)" fillOpacity={0.85} />
      <rect x={x(4)} y={36} width={x(6) - x(4)} height={18} rx={3} fill="var(--state-revisit)" fillOpacity={0.25} stroke="var(--state-revisit)" strokeDasharray="4 3" />
      <text x={x(5)} y={49} textAnchor="middle" fill="var(--state-revisit)" style={label()}>
        4 to 6 s
      </text>
      <line x1={30} y1={64} x2={310} y2={64} stroke="var(--color-border)" />
      {[0, 2, 4, 6].map((s) => (
        <g key={s}>
          <line x1={x(s)} y1={60} x2={x(s)} y2={68} stroke="var(--color-text-muted)" />
          <text x={x(s)} y={82} textAnchor="middle" fill="var(--color-text-muted)" style={label(8)}>
            {s}s
          </text>
        </g>
      ))}

      <g className={T} style={{ opacity: step >= 1 ? 1 : 0 }}>
        <rect x={100} y={98} width={140} height={74} rx={4} fill={step >= 2 ? "#000" : "none"} stroke="var(--color-text-muted)" strokeDasharray={step >= 2 ? undefined : "4 3"} className={T} />
        <text x={170} y={140} textAnchor="middle" fill="var(--color-text-muted)" style={{ ...label(14), transition: "opacity 0.7s", opacity: step >= 2 ? 0 : 1 }}>
          …
        </text>
        <polygon points="162,127 162,147 180,137" fill="var(--color-text-muted)" fillOpacity={0.5} style={{ transition: "opacity 0.7s", opacity: step >= 2 ? 1 : 0 }} />
        <rect x={100} y={182} width={100} height={5} rx={2} fill="var(--color-border)" />
        <rect x={100} y={194} width={70} height={5} rx={2} fill="var(--color-border)" />
      </g>
    </Frame>
  );
}

// ---- YouTube: playback ----

export function Playback({ step }: { step: number }) {
  const base = 176;
  const caption =
    step === 0
      ? "The adaptive bitrate algorithm could pick a resolution a device could not play smoothly. The Media Capabilities API was used to prevent that."
      : step === 1
        ? "In the experiment, the mean time between rebuffers (MTBR) increased by 7.1%."
        : "Average resolution, measured by video height, only declined by 0.4%.";

  return (
    <Frame title="YouTube: playback" caption={caption}>
      <g className={T} style={{ opacity: step === 0 ? 1 : 0 }}>
        <text x={30} y={26} fill="var(--color-text-muted)" style={label()}>
          resolutions the player could pick
        </text>
        {[0, 1, 2, 3, 4].map((i) => {
          const blocked = i >= 3;
          return <rect key={i} x={30} y={148 - i * 28} width={50 + i * 38} height={18} rx={3} fill={blocked ? "var(--state-revisit)" : "var(--state-got-it)"} fillOpacity={blocked ? 0.3 : 0.8} stroke={blocked ? "var(--state-revisit)" : "none"} strokeDasharray="4 3" />;
        })}
        <line x1={225} y1={36} x2={225} y2={172} stroke="var(--state-revisit)" strokeDasharray="4 3" />
        <text x={231} y={52} fill="var(--state-revisit)" style={label(8)}>
          above this the
        </text>
        <text x={231} y={63} fill="var(--state-revisit)" style={label(8)}>
          device struggles
        </text>
      </g>

      <g className={T} style={{ opacity: step >= 1 ? 1 : 0, transform: `translateX(${step >= 2 ? 0 : 60}px)` }}>
        <text x={20} y={26} fill="var(--color-text-muted)" style={label()}>
          mean time between rebuffers
        </text>
        <rect x={30} y={base - 100} width={44} height={100} rx={3} fill="var(--color-text-muted)" fillOpacity={0.5} />
        <rect x={86} y={base - 107.1} width={44} height={107.1} rx={3} fill="var(--state-got-it)" fillOpacity={0.85} />
        <text x={52} y={base + 13} textAnchor="middle" fill="var(--color-text-muted)" style={label(8)}>
          control
        </text>
        <text x={108} y={base + 13} textAnchor="middle" fill="var(--color-text-muted)" style={label(8)}>
          experiment
        </text>
        <text x={108} y={base - 113} textAnchor="middle" fill="var(--state-got-it)" style={label(11)}>
          +7.1%
        </text>
      </g>

      <g className={T} style={{ opacity: step >= 2 ? 1 : 0 }}>
        <text x={180} y={26} fill="var(--color-text-muted)" style={label()}>
          average resolution
        </text>
        <rect x={190} y={base - 100} width={44} height={100} rx={3} fill="var(--color-text-muted)" fillOpacity={0.5} />
        <rect x={246} y={base - 99.6} width={44} height={99.6} rx={3} fill="var(--state-learning)" fillOpacity={0.85} />
        <text x={212} y={base + 13} textAnchor="middle" fill="var(--color-text-muted)" style={label(8)}>
          control
        </text>
        <text x={268} y={base + 13} textAnchor="middle" fill="var(--color-text-muted)" style={label(8)}>
          experiment
        </text>
        <text x={268} y={base - 106} textAnchor="middle" fill="var(--state-learning)" style={label(11)}>
          −0.4%
        </text>
      </g>
    </Frame>
  );
}

// ---- Facebook: less CSS ----

export function CssShrink({ step }: { step: number }) {
  const caption =
    step === 0
      ? "Before: the old homepage loaded more than 400 KB of compressed CSS."
      : step === 1
        ? "After: the CSS on the homepage was reduced by 80 percent."
        : "Atomic CSS has a logarithmic growth curve: it is proportional to the number of unique style declarations, not to the number of styles and features written.";

  return (
    <Frame title="Facebook: less CSS" caption={caption}>
      <g className={T} style={{ opacity: step <= 1 ? 1 : 0 }}>
        <text x={30} y={58} fill="var(--color-text-muted)" style={label()}>
          old homepage CSS: more than 400 KB compressed
        </text>
        <rect x={30} y={66} width={280} height={24} rx={4} fill="var(--state-revisit)" fillOpacity={0.8} />
        <g className={T} style={{ opacity: step >= 1 ? 1 : 0 }}>
          <text x={30} y={122} fill="var(--color-text-muted)" style={label()}>
            new homepage CSS
          </text>
          <rect x={30} y={130} width={56} height={24} rx={4} fill="var(--state-got-it)" fillOpacity={0.85} />
          <text x={96} y={147} fill="var(--state-got-it)" style={label(12)}>
            80 percent less
          </text>
        </g>
      </g>

      <g className={T} style={{ opacity: step >= 2 ? 1 : 0 }}>
        <line x1={40} y1={180} x2={310} y2={180} stroke="var(--color-text-muted)" />
        <line x1={40} y1={46} x2={40} y2={180} stroke="var(--color-text-muted)" />
        <text x={44} y={42} fill="var(--color-text-muted)" style={label(8)}>
          CSS size
        </text>
        <text x={310} y={196} textAnchor="end" fill="var(--color-text-muted)" style={label(8)}>
          more styles and features
        </text>
        <line x1={40} y1={180} x2={300} y2={64} stroke="var(--state-revisit)" strokeWidth={2} />
        <text x={150} y={96} fill="var(--state-revisit)" style={label()}>
          CSS you write
        </text>
        <path d="M40 180 Q 80 104 300 96" fill="none" stroke="var(--state-got-it)" strokeWidth={2} />
        <text x={190} y={128} fill="var(--state-got-it)" style={label()}>
          atomic CSS
        </text>
      </g>
    </Frame>
  );
}

// ---- Facebook: JavaScript in tiers ----

export function JsTiers({ step }: { step: number }) {
  const caption =
    step === 0
      ? "Not all JavaScript is equally urgent."
      : step === 1
        ? "Facebook split the JavaScript needed for the initial load into three tiers."
        : "Tier 1: the first-paint layout and skeletons. Tier 2: everything needed to fully render above the fold. Tier 3: logging and live-updating data, which don't change the pixels.";
  const tiers = [
    { x: 30, w: 80, color: "var(--state-got-it)", name: "Tier 1" },
    { x: 110, w: 110, color: "var(--state-learning)", name: "Tier 2" },
    { x: 220, w: 90, color: "var(--color-text-muted)", name: "Tier 3" },
  ];

  return (
    <Frame title="Facebook: JavaScript in tiers" caption={caption}>
      <text x={30} y={34} fill="var(--color-text-muted)" style={label()}>
        JavaScript for the initial load
      </text>
      <rect x={30} y={44} width={280} height={34} rx={4} fill="var(--state-revisit)" fillOpacity={0.8} className={T} style={{ opacity: step === 0 ? 1 : 0 }} />
      {tiers.map((t) => (
        <g key={t.name} className={T} style={{ opacity: step >= 1 ? 1 : 0 }}>
          <rect x={t.x + 1} y={44} width={t.w - 2} height={34} rx={4} fill={t.color} fillOpacity={0.55} stroke={t.color} />
          <text x={t.x + t.w / 2} y={65} textAnchor="middle" fill="var(--color-text-primary)" style={label(10)}>
            {t.name}
          </text>
        </g>
      ))}

      <g className={T} style={{ opacity: step >= 2 ? 1 : 0 }}>
        {tiers.map((t, i) => {
          const sx = 30 + i * 104;
          return (
            <g key={t.name}>
              <rect x={sx} y={106} width={92} height={72} rx={4} fill="none" stroke={t.color} />
              {i === 0 ? (
                <>
                  <rect x={sx + 8} y={116} width={76} height={10} rx={2} fill="var(--color-border)" />
                  <rect x={sx + 8} y={134} width={56} height={10} rx={2} fill="var(--color-border)" />
                  <rect x={sx + 8} y={152} width={66} height={10} rx={2} fill="var(--color-border)" />
                </>
              ) : (
                <>
                  <rect x={sx + 8} y={116} width={76} height={10} rx={2} fill="var(--state-learning)" fillOpacity={0.7} />
                  <rect x={sx + 8} y={134} width={56} height={10} rx={2} fill="var(--state-learning)" fillOpacity={0.5} />
                  <rect x={sx + 8} y={152} width={66} height={10} rx={2} fill="var(--state-learning)" fillOpacity={0.35} />
                </>
              )}
              {i === 2 && <circle cx={sx + 82} cy={112} r={2.5} fill="var(--state-got-it)" />}
              <text x={sx + 46} y={194} textAnchor="middle" fill="var(--color-text-muted)" style={label(8)}>
                {["after Tier 1", "after Tier 2", "after Tier 3"][i]}
              </text>
            </g>
          );
        })}
      </g>
    </Frame>
  );
}

// ---- GitHub: when jQuery arrived ----

export function JqueryTimeline({ step }: { step: number }) {
  const caption =
    step === 0
      ? "GitHub.com pulled in jQuery 1.2.1 as a dependency in late 2007."
      : step === 1
        ? "Years later, the team found it could achieve everything it needed using standard browser APIs."
        : "A library that was essential in 2007 can be dead weight later. In 2018 the team wrote that it had recently completed the removal.";

  return (
    <Frame title="GitHub: when jQuery arrived" caption={caption}>
      <line x1={30} y1={64} x2={310} y2={64} stroke="var(--color-border)" strokeWidth={2} />
      <circle cx={50} cy={64} r={6} fill="var(--state-revisit)" />
      <text x={50} y={46} textAnchor="middle" fill="var(--color-text-muted)" style={label()}>
        late 2007
      </text>
      <text x={30} y={88} fill="var(--state-revisit)" style={label(10)}>
        jQuery 1.2.1 added
      </text>
      <text x={290} y={46} textAnchor="middle" fill="var(--color-text-muted)" style={label()}>
        2018
      </text>
      <g className={T} style={{ opacity: step >= 2 ? 1 : 0 }}>
        <circle cx={290} cy={64} r={6} fill="var(--state-got-it)" />
        <text x={310} y={88} textAnchor="end" fill="var(--state-got-it)" style={label(10)}>
          removal completed
        </text>
      </g>

      <g className={T} style={{ opacity: step >= 1 ? 1 : 0 }}>
        <rect x={30} y={130} width={90} height={36} rx={4} fill="none" stroke="var(--state-revisit)" strokeDasharray={step >= 2 ? "4 3" : undefined} className={T} style={{ opacity: step >= 2 ? 0.4 : 1 }} />
        <text x={75} y={152} textAnchor="middle" fill="var(--state-revisit)" style={{ ...label(11), opacity: step >= 2 ? 0.4 : 1, transition: "opacity 0.7s" }}>
          jQuery
        </text>
        <HArrow x1={124} x2={186} y={148} color="var(--color-text-muted)" />
        <rect x={190} y={130} width={120} height={36} rx={4} fill="var(--state-got-it)" fillOpacity={0.12} stroke="var(--state-got-it)" />
        <text x={250} y={152} textAnchor="middle" fill="var(--state-got-it)" style={label(8)}>
          standard browser APIs
        </text>
      </g>
    </Frame>
  );
}

// ---- GitHub: removing it slowly ----

export function JqueryDecline({ step }: { step: number }) {
  const caption =
    step === 0
      ? "They did not rewrite it in one go. They tracked jQuery usage over time."
      : step === 1
        ? "And a lint plugin would fail CI checks if anyone tried to use jQuery features."
        : "The expected prize: eventually dropping a 30 kB dependency from the packaged bundles.";

  return (
    <Frame title="GitHub: removing it slowly" caption={caption}>
      <line x1={30} y1={180} x2={310} y2={180} stroke="var(--color-text-muted)" />
      <line x1={30} y1={46} x2={30} y2={180} stroke="var(--color-text-muted)" />
      <text x={34} y={42} fill="var(--color-text-muted)" style={label(8)}>
        places jQuery is used
      </text>
      <text x={310} y={196} textAnchor="end" fill="var(--color-text-muted)" style={label(8)}>
        time
      </text>
      <path d="M30 70 C 110 74 150 150 300 172" fill="none" stroke="var(--state-learning)" strokeWidth={2.5} />
      <text x={150} y={96} fill="var(--state-learning)" style={label()}>
        usage, tracked over time
      </text>

      <g className={T} style={{ opacity: step >= 1 ? 1 : 0 }}>
        <line x1={62} y1={50} x2={62} y2={180} stroke="var(--state-revisit)" strokeDasharray="4 3" />
        <text x={68} y={128} fill="var(--state-revisit)" style={label(8)}>
          lint plugin:
        </text>
        <text x={68} y={139} fill="var(--state-revisit)" style={label(8)}>
          CI fails on new
        </text>
        <text x={68} y={150} fill="var(--state-revisit)" style={label(8)}>
          jQuery use
        </text>
      </g>

      <g className={T} style={{ opacity: step >= 2 ? 1 : 0 }}>
        <rect x={236} y={132} width={64} height={18} rx={3} fill="var(--state-got-it)" fillOpacity={0.25} stroke="var(--state-got-it)" strokeDasharray="4 3" />
        <text x={268} y={145} textAnchor="middle" fill="var(--state-got-it)" style={label(10)}>
          −30 kB
        </text>
      </g>
    </Frame>
  );
}

// ---- Figma: the port ----

function PipelineRow({ y, middle, color, dim }: { y: number; middle: string; color: string; dim: boolean }) {
  return (
    <g className={T} style={{ opacity: dim ? 0.35 : 1 }}>
      <rect x={20} y={y} width={50} height={28} rx={4} fill="none" stroke="var(--color-text-muted)" />
      <text x={45} y={y + 18} textAnchor="middle" fill="var(--color-text-primary)" style={label(10)}>
        C++
      </text>
      <HArrow x1={74} x2={98} y={y + 14} />
      <rect x={102} y={y} width={124} height={28} rx={4} fill={color} fillOpacity={0.14} stroke={color} />
      <text x={164} y={y + 18} textAnchor="middle" fill={color} style={label(9)}>
        {middle}
      </text>
      <HArrow x1={230} x2={254} y={y + 14} />
      <rect x={258} y={y} width={52} height={28} rx={4} fill="none" stroke="var(--color-text-muted)" />
      <text x={284} y={y + 18} textAnchor="middle" fill="var(--color-text-primary)" style={label(9)}>
        browser
      </text>
    </g>
  );
}

export function WasmPort({ step }: { step: number }) {
  const caption =
    step === 0
      ? "Before WebAssembly, C++ code could run in the browser by cross-compiling it to asm.js, a subset of JavaScript."
      : "WebAssembly is a binary format for machine code, designed with browsers in mind and as fast as possible to parse.";

  return (
    <Frame title="Figma: the port" caption={caption}>
      <PipelineRow y={50} middle="asm.js (JavaScript subset)" color="var(--state-revisit)" dim={step >= 1} />
      <g className={T} style={{ opacity: step >= 1 ? 1 : 0 }}>
        <PipelineRow y={110} middle="WebAssembly (binary)" color="var(--state-got-it)" dim={false} />
        <text x={164} y={158} textAnchor="middle" fill="var(--state-got-it)" style={label(8)}>
          as fast as possible to parse
        </text>
      </g>
    </Frame>
  );
}

// ---- Figma: the load ----

export function WasmLoad({ step }: { step: number }) {
  const caption =
    step === 0
      ? "Load time improved by more than 3x after the switch, regardless of document size."
      : "Same product. Different compile target. Three times faster to load.";

  return (
    <Frame title="Figma: load time" caption={caption}>
      <text x={30} y={46} fill="var(--color-text-muted)" style={label()}>
        load time
      </text>
      <rect x={30} y={58} width={250} height={24} rx={4} fill="var(--state-revisit)" fillOpacity={0.8} />
      <text x={288} y={74} fill="var(--state-revisit)" style={label(9)}>
        asm.js
      </text>
      <rect x={30} y={96} width={80} height={24} rx={4} fill="var(--state-got-it)" fillOpacity={0.85} />
      <text x={118} y={112} fill="var(--state-got-it)" style={label(9)}>
        WebAssembly
      </text>
      <text x={30} y={156} fill="var(--state-got-it)" style={label(13)}>
        more than 3x faster
      </text>
      <g className={T} style={{ opacity: step >= 1 ? 1 : 0 }}>
        <text x={30} y={186} fill="var(--color-text-muted)" style={label(9)}>
          same product, different compile target
        </text>
      </g>
    </Frame>
  );
}
