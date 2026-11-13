import styles from "./hero.module.css";

// Underground cross-section in a 1440x720 box (anchored right, centred vertically when cropped).
// Layers read top to bottom like a survey log; a truck-mounted borewell rig works above the hole.
export const ART = { w: 1440, h: 720 };
export const SURFACE = 230;
export const GROUND = { x: 0, y: SURFACE, w: 1440, h: ART.h - SURFACE };

const S = SURFACE;
const H = ART.h;
const PANEL_EDGE = `M430,${S} C520,${S + 80} 560,${S + 190} 700,${S + 310} C790,${S + 385} 880,${S + 440} 930,${H}`;
const PANEL = `M0,150 C150,115 330,150 430,${S} C520,${S + 80} 560,${S + 190} 700,${S + 310} C790,${S + 385} 880,${S + 440} 930,${H} L0,${H} Z`;

const wave = (y, a = 14) =>
  `M0,${y} C240,${y - a} 480,${y + a} 720,${y} C960,${y - a} 1200,${y + a} 1440,${y - 2} L1440,${H} L0,${H} Z`;

const B = [S, S + 82, S + 190, S + 300, S + 400]; // layer tops
const AQ = B[4];
const RULER = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ f, ft: Math.round(60 + 160 * f) }));
const LABELS = ["Laterite", "Murram", "Weathered rock", "Fractured basalt", "Aquifer"].map((t, i) => ({
  t,
  y: (B[i] + (B[i + 1] ?? H)) / 2 + 5,
}));

const wavePath = (y, a) => {
  let d = `M-200,${y}`;
  for (let x = -200; x < 1600; x += 200) d += ` C${x + 50},${y - a} ${x + 150},${y + a} ${x + 200},${y}`;
  return d;
};

const HX = 1060; // hole and mast x
const K = 0.78; // rig scale
const BIT_Y = AQ + 38;
const RW = 8 * K; // rod width, same above and below ground
const SO = 280; // y of the ground line in the rig's own (unscaled) drawing space
const stripesBelow = Array.from({ length: Math.ceil((BIT_Y - S) / 12.5) + 3 }, (_, i) => S - 12.5 + i * 12.5);
const stripesTop = Array.from({ length: 14 }, (_, i) => 160 + i * 16);

export default function HeroArt() {
  return (
    <svg
      className={styles.art}
      viewBox={`0 0 ${ART.w} ${ART.h}`}
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FD0F0" />
          <stop offset="1" stopColor="#F6F1E4" />
        </linearGradient>
        <linearGradient id="aq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FD0F0" />
          <stop offset="0.45" stopColor="#3f8ac0" />
          <stop offset="1" stopColor="#0B2A4A" />
        </linearGradient>
        <filter id="speckle" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="8" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -11 6.1" />
        </filter>
        <clipPath id="ground">
          <rect x="0" y={S} width={ART.w} height={H - S} />
        </clipPath>
        <clipPath id="rodBelow">
          <rect x={HX - RW / 2} y={S} width={RW} height={BIT_Y - S} />
        </clipPath>
        <clipPath id="aboveGround">
          <rect x="0" y="0" width={ART.w} height={SO} />
        </clipPath>
      </defs>

      <rect width={ART.w} height={S + 14} fill="url(#sky)" />

      {/* strata, painted top-down */}
      <path d={wave(B[0], 9)} fill="#7a4a30" />
      <path d={wave(B[1], 14)} fill="#563a2a" />
      <path d={wave(B[2], 16)} fill="#34302d" />
      <path d={wave(B[3], 14)} fill="#1f2226" />
      <path d={wave(B[4], 10)} fill="url(#aq)" />

      <g clipPath="url(#ground)">
        <rect y={S} width={ART.w} height={H} filter="url(#speckle)" opacity="0.16" />
        <g className={styles.waveA}>
          <path d={wavePath(AQ + 2, 14)} fill="none" stroke="#F6F1E4" strokeWidth="2.5" opacity="0.55" />
        </g>
        <g className={styles.waveB}>
          <path d={wavePath(AQ + 20, 10)} fill="none" stroke="#8FD0F0" strokeWidth="2" opacity="0.5" />
        </g>
        {[760, 880, 980, 1180, 1300].map((x, i) => (
          <circle key={x} className={styles.bubble} style={{ animationDelay: `${-i * 1.3}s` }} cx={x} cy={AQ + 70} r={3.5 + (i % 3)} fill="#F6F1E4" opacity="0.5" />
        ))}
      </g>

      {/* borewell shaft with casing and the turning drill string */}
      <rect x={HX - 6.3} y={S} width="12.6" height={BIT_Y - S} fill="#0b0d0f" />
      <path d={`M${HX - 6.3},${S} V${S + 150} M${HX + 6.3},${S} V${S + 150}`} stroke="#F6F1E4" strokeWidth="2.2" opacity="0.8" />
      <g clipPath="url(#rodBelow)">
        <rect x={HX - RW / 2} y={S} width={RW} height={BIT_Y - S} fill="#8a96a3" />
        <g className={styles.rodSpin}>
          {stripesBelow.map((y) => (
            <path key={y} d={`M${HX - RW / 2},${y + 7} L${HX + RW / 2},${y}`} stroke="#F6F1E4" strokeWidth="3.6" />
          ))}
        </g>
      </g>

      {/* bit: toothed ring spins, cones turn, chips fly */}
      <g transform={`translate(${HX} ${BIT_Y}) scale(${K})`}>
        <path d="M-14,-6 L14,-6 L11,14 L-11,14 Z" fill="#F6F1E4" stroke="#14181C" strokeWidth="2" />
        <g className={styles.bitTurn}>
          <path d="M-8,-4 V12 M0,-4 V12 M8,-4 V12" stroke="#14181C" strokeWidth="2.4" />
        </g>
        <ellipse cx="0" cy="14" rx="13" ry="4.5" fill="#14181C" />
        <ellipse className={styles.teeth} cx="0" cy="14" rx="13" ry="4.5" fill="none" stroke="#F6F1E4" strokeWidth="2.6" strokeDasharray="3 4" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} className={styles.chip} style={{ animationDelay: `${-i * 0.35}s`, "--dx": `${(i % 2 ? 1 : -1) * (14 + i * 6)}px` }} cx="0" cy="16" r="2.2" fill="#8FD0F0" />
        ))}
      </g>

      {/* truck-mounted borewell rig, drawn at full size then scaled to sit on the ground line */}
      <g transform={`translate(${HX} ${S}) scale(${K}) translate(${-HX} ${-SO})`}>
        {[838, 936, 1000].map((x) => (
          <g key={x}>
            <circle cx={x} cy={255} r="25" fill="#14181C" />
            <circle cx={x} cy={255} r="11" fill="#cfd8de" />
            <circle cx={x} cy={255} r="4" fill="#14181C" />
          </g>
        ))}
        <rect x="796" y="214" width="250" height="22" fill="#0B2A4A" />
        <rect x="884" y="184" width="162" height="30" fill="#14181C" />
        <rect x="892" y="142" width="62" height="72" rx="4" fill="#1b5d8f" />
        <path d="M902,156 H946 M902,168 H946 M902,180 H946" stroke="#F6F1E4" strokeWidth="2" opacity="0.5" />
        <rect x="962" y="160" width="72" height="54" rx="22" fill="#3f8ac0" />
        <rect x="962" y="180" width="72" height="8" fill="#8FD0F0" opacity="0.7" />
        <polygon points="796,214 796,162 808,150 858,150 884,188 884,214" fill="#0B2A4A" />
        <polygon points="812,160 852,160 872,186 812,186" fill="#8FD0F0" />
        <rect x="796" y="202" width="88" height="8" fill="#8FD0F0" />
        <rect x="878" y="118" width="7" height="46" fill="#14181C" />
        <path d="M1030,234 L1040,280" stroke="#14181C" strokeWidth="6" strokeLinecap="round" />
        <rect x="1026" y="277" width="24" height="5" rx="2" fill="#14181C" />

        <g className={styles.mast}>
          <g stroke="#0B2A4A" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d={`M${HX - 14},214 V104 M${HX + 14},214 V104`} strokeWidth="5" />
            <path d={`M${HX - 14},214 L${HX + 14},192 L${HX - 14},170 L${HX + 14},148 L${HX - 14},126 L${HX + 14},104`} strokeWidth="2.4" />
            <path d={`M${HX + 14},214 L${HX - 14},192 L${HX + 14},170 L${HX - 14},148 L${HX + 14},126 L${HX - 14},104`} strokeWidth="2.4" />
          </g>
          <rect x={HX - 22} y="96" width="44" height="12" rx="3" fill="#0B2A4A" />
          <circle cx={HX} cy="100" r="7" fill="#F6F1E4" stroke="#14181C" strokeWidth="2" />
          <path d={`M954,148 C960,112 1010,104 ${HX - 18},138`} stroke="#14181C" strokeWidth="3" fill="none" opacity="0.7" className={styles.hose} />
          <g clipPath="url(#aboveGround)">
            <g className={styles.head}>
              <rect x={HX - 4} y="160" width="8" height="150" fill="#8a96a3" />
              <g className={styles.rodSpinTop}>
                {stripesTop.map((y) => (
                  <path key={y} d={`M${HX - 4},${y + 8} L${HX + 4},${y}`} stroke="#F6F1E4" strokeWidth="4.5" />
                ))}
              </g>
              <rect x={HX - 20} y="126" width="40" height="30" rx="5" fill="#1b5d8f" stroke="#0B2A4A" strokeWidth="2.5" />
              <rect x={HX - 20} y="136" width="40" height="7" fill="#8FD0F0" />
              <rect x={HX - 7} y="156" width="14" height="10" fill="#14181C" />
            </g>
          </g>
        </g>

        {[0, 1, 2].map((i) => (
          <circle key={i} className={styles.puff} style={{ animationDelay: `${-i * 1.1}s` }} cx="881" cy="112" r="5" fill="#F6F1E4" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} className={styles.dust} style={{ animationDelay: `${-i * 0.7}s`, "--dx": `${i % 2 ? 26 : -26}px` }} cx={HX} cy={SO - 4} rx="10" ry="6" fill="#d9c9ad" />
        ))}
      </g>

      {/* depth ruler: matches the readout scale */}
      <g className={styles.ruler} fill="#F6F1E4" fontSize="14" fontWeight="600">
        {RULER.map((r) => {
          const y = S + r.f * (H - S);
          const ty = Math.min(Math.max(y, S + 16), H - 12);
          return (
            <g key={r.ft} opacity="0.75">
              <path d={`M${HX - 56},${y} H${HX - 28}`} stroke="#F6F1E4" strokeWidth="2" />
              <text x={HX - 64} y={ty + 5} textAnchor="end">
                {r.ft} ft
              </text>
            </g>
          );
        })}
      </g>

      <g className={styles.geoLabels} fill="#F6F1E4" fontSize="14" fontWeight="600" textAnchor="end" opacity="0.65">
        {LABELS.map((l) => (
          <text key={l.t} x="1410" y={l.y}>
            {l.t}
          </text>
        ))}
      </g>

      {/* cream panel carrying the headline; its edge flows down into the ground */}
      <path className={styles.panel} d={PANEL} fill="#F6F1E4" />
      <path className={styles.panel} d={PANEL_EDGE} fill="none" stroke="#8FD0F0" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
      <path className={styles.panel} d={`M392,${S - 34} C500,${S + 50} 540,${S + 170} 690,${S + 290} C770,${S + 354} 850,${S + 400} 890,${S + 450}`} fill="none" stroke="#8FD0F0" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}
