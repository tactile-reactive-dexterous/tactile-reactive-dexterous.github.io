"use client";

import { useInView } from "@/lib/useInView";

// Animated data-efficiency curve. The paper reports the qualitative result —
// tactile-grounded mid-training lifts the low-data regime so far fewer
// downstream demos are needed — but does not tabulate per-point values, so the
// two curves below are an illustrative trend (clearly labelled as such). Both
// curves "draw on" via an animated stroke-dashoffset when scrolled into view.

const W = 720;
const H = 380;
const M = { top: 28, right: 24, bottom: 52, left: 56 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

const X_MIN = 10;
const X_MAX = 200;
const Y_MAX = 100;

const sx = (demos: number) => M.left + ((demos - X_MIN) / (X_MAX - X_MIN)) * PW;
const sy = (sr: number) => M.top + PH - (sr / Y_MAX) * PH;

// illustrative monotonic concave curves
const WITH_MID = [
  [10, 52], [25, 63], [50, 70], [100, 75], [150, 78], [200, 80],
];
const NO_MID = [
  [10, 18], [25, 30], [50, 45], [100, 60], [150, 68], [200, 74],
];

function smoothPath(pts: number[][]) {
  // Catmull-Rom → cubic Bézier for a smooth line.
  if (pts.length < 2) return "";
  const p = pts.map(([d, v]) => [sx(d), sy(v)]);
  let path = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    path += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return path;
}

export default function DataEfficiencyCurve({ figureNumber }: { figureNumber: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const withPath = smoothPath(WITH_MID);
  const noPath = smoothPath(NO_MID);
  const xTicks = [10, 50, 100, 150, 200];
  const yTicks = [0, 25, 50, 75, 100];

  const drawStyle = (delay: number) => ({
    strokeDasharray: 1,
    strokeDashoffset: inView ? 0 : 1,
    transition: `stroke-dashoffset 1.8s ease ${delay}s`,
  } as const);

  return (
    <figure className="trex-figure de-curve" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Data efficiency: success rate vs number of downstream demonstrations">
        {/* grid + axes */}
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line className="de-grid" x1={M.left} y1={sy(t)} x2={M.left + PW} y2={sy(t)} />
            <text className="de-tick" x={M.left - 10} y={sy(t) + 4} textAnchor="end">{t}%</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <text className="de-tick" x={sx(t)} y={M.top + PH + 18} textAnchor="middle">{t}</text>
          </g>
        ))}
        <line className="de-axis" x1={M.left} y1={M.top + PH} x2={M.left + PW} y2={M.top + PH} />
        <line className="de-axis" x1={M.left} y1={M.top} x2={M.left} y2={M.top + PH} />
        <text className="de-tick" x={M.left + PW / 2} y={H - 12} textAnchor="middle" style={{ fontSize: 13 }}>
          # downstream demonstrations
        </text>
        <text className="de-tick" x={18} y={M.top + PH / 2} textAnchor="middle" transform={`rotate(-90 18 ${M.top + PH / 2})`} style={{ fontSize: 13 }}>
          success rate
        </text>

        {/* areas */}
        <path className="de-area" d={`${withPath} L ${sx(200)} ${sy(0)} L ${sx(10)} ${sy(0)} Z`} fill="var(--trex-gold-bright)" style={{ opacity: inView ? 0.12 : 0, transition: "opacity 1.4s ease 0.6s" }} />

        {/* lines (draw-on) */}
        <path className="de-line" d={noPath} stroke="var(--trex-slow)" pathLength={1} style={drawStyle(0.1)} />
        <path className="de-line" d={withPath} stroke="var(--trex-gold-bright)" pathLength={1} style={drawStyle(0)} />

        {/* end dots */}
        <circle cx={sx(200)} cy={sy(80)} r={5} fill="var(--trex-gold-bright)" stroke="#fff" strokeWidth={1.5} style={{ opacity: inView ? 1 : 0, transition: "opacity 0.4s ease 1.7s" }} />
        <circle cx={sx(200)} cy={sy(74)} r={5} fill="var(--trex-slow)" stroke="#fff" strokeWidth={1.5} style={{ opacity: inView ? 1 : 0, transition: "opacity 0.4s ease 1.8s" }} />
      </svg>
      <div className="de-legend">
        <span><i style={{ background: "var(--trex-gold-bright)" }} /> With tactile-grounded mid-training</span>
        <span><i style={{ background: "var(--trex-slow)" }} /> Without mid-training</span>
      </div>
      <figcaption>
        Figure {figureNumber}: Data efficiency (illustrative trend). Tactile-grounded mid-training lifts performance most
        in the low-data regime — far fewer downstream demonstrations are needed to reach a given success level, with the
        gap widest at small demo counts.
      </figcaption>
    </figure>
  );
}
