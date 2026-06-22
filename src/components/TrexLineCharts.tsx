"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/useInView";

// Animated multi-panel line charts in the ENPIRE house style: a progress value
// 0→1 (looping, eased, paused when off-screen) progressively draws each curve
// left-to-right behind a moving cursor; data points reveal as the cursor
// passes, hovering a point shows a tooltip, and (where there are multiple
// series) the legend toggles a highlight. Reuses the template's aeb-* styling.

const VIEW_W = 360;
const VIEW_H = 264;
const M = { top: 22, right: 14, bottom: 48, left: 46 };
const PLOT_W = VIEW_W - M.left - M.right;
const PLOT_H = VIEW_H - M.top - M.bottom;
const DURATION = 5200;
const HOLD = 1100;

// Round coordinates so SSR and client render byte-identical strings.
const r3 = (n: number) => Math.round(n * 1000) / 1000;

type Series = { key: string; label: string; color: string; values: number[] };
type Panel = {
  title: string;
  xTicks: (number | string)[];
  yMin: number;
  yMax: number;
  yTicks: number[];
  series: Series[];
};

function scaleX(i: number, n: number) {
  return r3(M.left + (n <= 1 ? 0 : i / (n - 1)) * PLOT_W);
}
function scaleY(v: number, min: number, max: number) {
  return r3(M.top + PLOT_H - ((v - min) / (max - min)) * PLOT_H);
}

// Path for one series, revealed up to a fractional index cutoff.
function linePath(values: number[], cutoff: number, yMin: number, yMax: number) {
  const n = values.length;
  const pts: [number, number][] = [];
  for (let i = 0; i < n && i <= cutoff; i++) pts.push([i, values[i]]);
  const fi = Math.floor(cutoff);
  if (fi >= 0 && fi < n - 1 && cutoff > fi) {
    const frac = cutoff - fi;
    pts.push([cutoff, values[fi] + (values[fi + 1] - values[fi]) * frac]);
  }
  if (pts.length < 1) return "";
  return pts.map(([x, y], k) => `${k === 0 ? "M" : "L"} ${scaleX(x, n)} ${scaleY(y, yMin, yMax)}`).join(" ");
}

type Hover = { x: number; y: number; title: string; line: string; color: string } | null;

function Panel({
  panel,
  progress,
  active,
  hover,
  setHover,
}: {
  panel: Panel;
  progress: number;
  active: string | null;
  hover: Hover;
  setHover: (h: Hover) => void;
}) {
  const n = panel.xTicks.length;
  const cutoff = (n - 1) * progress;
  const cursorX = scaleX(cutoff, n);

  const tip = (e: React.MouseEvent, title: string, line: string, color: string) => {
    const box = (e.currentTarget.closest(".trexlc-panel") as HTMLElement).getBoundingClientRect();
    const rx = e.clientX - box.left;
    setHover({ x: rx > box.width - 130 ? rx - 12 : rx + 12, y: e.clientY - box.top - 10, title, line, color });
  };

  return (
    <div className="trexlc-panel">
      <h4 className="aeb-chart-title">{panel.title}</h4>
      <svg className="aeb-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label={panel.title}>
        {/* grid + y ticks */}
        {panel.yTicks.map((t) => (
          <g key={`y${t}`}>
            <line x1={M.left} y1={scaleY(t, panel.yMin, panel.yMax)} x2={M.left + PLOT_W} y2={scaleY(t, panel.yMin, panel.yMax)} className="aeb-grid" />
            <text x={M.left - 8} y={scaleY(t, panel.yMin, panel.yMax) + 4} textAnchor="end" className="aeb-tick">{t}</text>
          </g>
        ))}
        {/* axes */}
        <line x1={M.left} y1={M.top + PLOT_H} x2={M.left + PLOT_W} y2={M.top + PLOT_H} className="aeb-axis" />
        <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + PLOT_H} className="aeb-axis" />
        {/* x ticks */}
        {panel.xTicks.map((t, i) => (
          <text key={`x${i}`} x={scaleX(i, n)} y={M.top + PLOT_H + 16} textAnchor="middle" className="aeb-tick">{t}</text>
        ))}
        <text transform={`translate(13 ${M.top + PLOT_H / 2}) rotate(-90)`} textAnchor="middle" className="aeb-axis-label">
          Success Rate (%)
        </text>

        {/* moving cursor */}
        <g className="aeb-time-cursor">
          <line x1={cursorX} y1={M.top} x2={cursorX} y2={M.top + PLOT_H} />
        </g>

        {/* series lines */}
        {panel.series.map((s) => (
          <path
            key={s.key}
            d={linePath(s.values, cutoff, panel.yMin, panel.yMax)}
            fill="none"
            stroke={s.color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={active && active !== s.key ? 0.18 : 0.95}
          />
        ))}

        {/* revealed data points */}
        {panel.series.map((s) =>
          s.values.map((v, i) => {
            if (i > cutoff + 1e-6) return null;
            const cx = scaleX(i, n);
            const cy = scaleY(v, panel.yMin, panel.yMax);
            return (
              <circle
                key={`${s.key}-${i}`}
                cx={cx}
                cy={cy}
                r={4}
                fill={s.color}
                stroke="#fff"
                strokeWidth={1.2}
                opacity={active && active !== s.key ? 0.2 : 1}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => tip(e, `${s.label} · ${panel.xTicks[i]}`, `${v}%`, s.color)}
                onMouseLeave={() => setHover(null)}
              />
            );
          }),
        )}
      </svg>
      {hover ? (
        <div className="aeb-tooltip" style={{ position: "absolute", left: hover.x, top: hover.y, transform: "translateY(-100%)", pointerEvents: "none", zIndex: 10 }}>
          <strong>{hover.title}</strong>
          <span style={{ color: hover.color }}>{hover.line}</span>
        </div>
      ) : null}
    </div>
  );
}

export default function TrexLineFigure({
  panels,
  legend,
  xAxisLabel,
  caption,
  ariaLabel,
}: {
  panels: Panel[];
  legend?: Series[];
  xAxisLabel: string;
  caption: React.ReactNode;
  ariaLabel: string;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.25);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<Hover>(null);
  const progressRef = useRef(0);

  useEffect(() => { progressRef.current = progress; }, [progress]);

  useEffect(() => {
    if (paused || !inView) return; // only animate while on screen
    const cycle = DURATION + HOLD;
    let raf = 0;
    const start = performance.now() - progressRef.current * DURATION;
    const tick = (t: number) => {
      const elapsed = (t - start) % cycle;
      const raw = Math.min(1, elapsed / DURATION);
      setProgress(1 - Math.pow(1 - raw, 3)); // ease-out cubic
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [paused, inView]);

  return (
    <figure className="trexlc-figure" ref={ref} aria-label={ariaLabel}>
      <div className="trex-fig-controls">
        <button className="trex-btn" onClick={() => setPaused((p) => !p)} type="button">
          {paused ? "Play" : "Pause"}
        </button>
        <input
          aria-label="Animation progress"
          className="trex-range"
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(e) => { setPaused(true); setProgress(Number(e.currentTarget.value)); }}
        />
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(progress * 100)}%</span>
      </div>

      <div className="trexlc-grid">
        {panels.map((p) => (
          <Panel key={p.title} panel={p} progress={progress} active={active} hover={hover} setHover={setHover} />
        ))}
      </div>

      <div className="trexlc-xlabel">{xAxisLabel}</div>

      {legend ? (
        <div className="trexlc-legend">
          {legend.map((s) => (
            <button
              key={s.key}
              type="button"
              className="trexlc-legend__item"
              data-dim={active && active !== s.key ? "true" : undefined}
              onMouseEnter={() => setActive(s.key)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive((a) => (a === s.key ? null : s.key))}
            >
              <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true">
                <line x1="2" y1="5" x2="24" y2="5" stroke={s.color} strokeWidth="3" strokeLinecap="round" />
              </svg>
              {s.label}
            </button>
          ))}
        </div>
      ) : null}

      <figcaption className="trex-caption">{caption}</figcaption>
    </figure>
  );
}

// ---- Figure data (read from the paper's Fig. 4 / Fig. 5) ------------------
const PURPLE = "#6f5bd0";
const BLUE = "#3b6fb0";
const GREEN = "#7a9e4f";

export const SPLIT_STEP_PANELS: Panel[] = [
  { title: "Apply Toothpaste", xTicks: [1, 2, 4, 6, 8], yMin: 60, yMax: 68, yTicks: [60, 62, 64, 66, 68], series: [{ key: "v", label: "Apply Toothpaste", color: PURPLE, values: [62, 65, 66, 66, 64] }] },
  { title: "Split Cup", xTicks: [1, 2, 4, 6, 8], yMin: 70, yMax: 78, yTicks: [70, 72, 74, 76, 78], series: [{ key: "v", label: "Split Cup", color: PURPLE, values: [71, 74, 75, 78, 73] }] },
  { title: "Extract Card", xTicks: [1, 2, 4, 6, 8], yMin: 64, yMax: 72, yTicks: [64, 66, 68, 70, 72], series: [{ key: "v", label: "Extract Card", color: PURPLE, values: [66, 65, 68, 70, 68] }] },
];

const EFF_X = [10, 20, 50, 100, 200];
export const DATA_EFFICIENCY_PANELS: Panel[] = [
  { title: "Apply Toothpaste", xTicks: EFF_X, yMin: 0, yMax: 80, yTicks: [0, 20, 40, 60, 80], series: [
    { key: "with", label: "With T-Rex mid-training", color: BLUE, values: [29, 51, 60, 66, 71] },
    { key: "without", label: "Without mid-training", color: GREEN, values: [9, 18, 30, 34, 36] },
  ] },
  { title: "Split Cup", xTicks: EFF_X, yMin: 10, yMax: 90, yTicks: [10, 30, 50, 70, 90], series: [
    { key: "with", label: "With T-Rex mid-training", color: BLUE, values: [36, 59, 70, 78, 85] },
    { key: "without", label: "Without mid-training", color: GREEN, values: [17, 33, 42, 52, 55] },
  ] },
  { title: "Extract Card", xTicks: EFF_X, yMin: 0, yMax: 80, yTicks: [0, 20, 40, 60, 80], series: [
    { key: "with", label: "With T-Rex mid-training", color: BLUE, values: [26, 48, 60, 70, 78] },
    { key: "without", label: "Without mid-training", color: GREEN, values: [12, 20, 36, 46, 50] },
  ] },
];

export const DATA_EFFICIENCY_LEGEND: Series[] = [
  { key: "with", label: "With T-Rex mid-training", color: BLUE, values: [] },
  { key: "without", label: "Without mid-training", color: GREEN, values: [] },
];
