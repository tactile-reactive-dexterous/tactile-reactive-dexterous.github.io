"use client";

import { useState } from "react";
import { CATEGORY_DURATION, VERB_HOURS } from "@/data/trex";
import { useInView } from "@/lib/useInView";

// Interactive SVG re-creations of the original matplotlib pie / verb-hours bar
// charts (same data, same layout: % labels on the wedges + compact right-hand
// legend; bars on a 0–6 h axis with a vertical "Hours (h)" label and rotated
// tick labels). Slices and bars brighten on hover and surface a tooltip.

const TOTAL_HOURS = CATEGORY_DURATION.reduce((s, c) => s + c.hours, 0);

type Tip = { x: number; y: number; title: string; line: string; swatch: string } | null;

function Tooltip({ tip }: { tip: Tip }) {
  if (!tip) return null;
  return (
    <div className="dc-tip" style={{ left: tip.x, top: tip.y }} role="status">
      <div className="dc-tip__title">{tip.title}</div>
      <div className="dc-tip__row">
        <i style={{ background: tip.swatch }} /> {tip.line}
      </div>
    </div>
  );
}

function tipPos(e: React.MouseEvent, pad = 14) {
  const box = (e.currentTarget.closest(".dc-chart") as HTMLElement).getBoundingClientRect();
  return { x: e.clientX - box.left + pad, y: e.clientY - box.top + pad };
}

// --- Pie: demonstration time per task category -----------------------------
function polar(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
}

export function CategoryPie() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip>(null);
  const cx = 130;
  const cy = 130;
  const r = 122;

  // Wedges drawn clockwise from the top, matching the published figure order.
  let acc = 0;
  const slices = CATEGORY_DURATION.map((c) => {
    const start = (acc / TOTAL_HOURS) * 360;
    acc += c.hours;
    const end = (acc / TOTAL_HOURS) * 360;
    return { ...c, start, end, pct: (c.hours / TOTAL_HOURS) * 100 };
  });

  return (
    <div
      className="dc-chart dc-pie"
      ref={ref}
      onMouseLeave={() => {
        setActive(null);
        setTip(null);
      }}
    >
      <svg viewBox="0 0 260 260" className="dc-pie__svg" role="img" aria-label="Demonstration time per task category">
        <g
          className="dc-pie__g"
          style={{ transform: inView ? "scale(1)" : "scale(0.6)", opacity: inView ? 1 : 0, transformOrigin: "center" }}
        >
          {slices.map((s, i) => {
            const mid = (s.start + s.end) / 2;
            const pop = active === i ? polar(0, 0, 8, mid) : { x: 0, y: 0 };
            const lbl = polar(cx, cy, r * 0.72, mid);
            return (
              <g key={s.name} style={{ transform: `translate(${pop.x}px, ${pop.y}px)` }} className="dc-pie__slice-g">
                <path
                  d={arcPath(cx, cy, r, s.start, s.end)}
                  fill={s.color}
                  stroke="#fff"
                  strokeWidth={1.4}
                  className="dc-pie__slice"
                  data-dim={active !== null && active !== i ? "true" : undefined}
                  onMouseEnter={(e) => {
                    setActive(i);
                    const p = tipPos(e);
                    setTip({ x: p.x, y: p.y, title: s.name, line: `${s.hours.toFixed(2)} h · ${s.pct.toFixed(1)}%`, swatch: s.color });
                  }}
                  onMouseMove={(e) => setTip((t) => (t ? { ...t, ...tipPos(e) } : t))}
                />
                <text x={lbl.x} y={lbl.y} className="dc-pie__pct" textAnchor="middle" dominantBaseline="central">
                  {s.pct.toFixed(1)}%
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <ul className="dc-legend">
        {slices.map((s, i) => (
          <li
            key={s.name}
            data-dim={active !== null && active !== i ? "true" : undefined}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <i style={{ background: s.color }} />
            {s.name}
          </li>
        ))}
      </ul>
      <Tooltip tip={tip} />
    </div>
  );
}

// --- Bars: demonstration hours per motion primitive ------------------------
// Blue gradient: darkest for the tallest bar, lightest for the shortest
// (matplotlib Blues 0.7 -> 0.3).
function blueFor(i: number, n: number) {
  const t = n > 1 ? i / (n - 1) : 0;
  return `hsl(212 64% ${34 + t * 46}%)`;
}

export function VerbBars() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip>(null);

  const n = VERB_HOURS.length;
  const W = 720;
  const H = 320;
  const ml = 44; // left margin (y-axis + "Hours (h)")
  const mr = 10;
  const mt = 12;
  const mb = 86; // bottom margin for rotated labels
  const plotW = W - ml - mr;
  const plotH = H - mt - mb;
  const baseline = mt + plotH;
  const axisMax = 6.4; // ticks at 0,2,4,6; tallest bar (6.11) fits
  const yOf = (h: number) => baseline - (h / axisMax) * plotH;
  const slot = plotW / n;
  const barW = slot * 0.66;

  return (
    <div className="dc-chart dc-bars" ref={ref} onMouseLeave={() => { setActive(null); setTip(null); }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="dc-bars__svg" role="img" aria-label="Demonstration hours per motion primitive">
        {/* y grid + ticks */}
        {[0, 2, 4, 6].map((g) => (
          <g key={g}>
            <line x1={ml} y1={yOf(g)} x2={W - mr} y2={yOf(g)} className="dc-bars__grid" />
            <text x={ml - 8} y={yOf(g)} className="dc-bars__ytick" textAnchor="end" dominantBaseline="central">
              {g}
            </text>
          </g>
        ))}
        {/* axes */}
        <line x1={ml} y1={mt} x2={ml} y2={baseline} className="dc-bars__axis" />
        <line x1={ml} y1={baseline} x2={W - mr} y2={baseline} className="dc-bars__axis" />
        <text className="dc-bars__ytitle" transform={`translate(13 ${mt + plotH / 2}) rotate(-90)`} textAnchor="middle">
          Hours (h)
        </text>
        {/* bars */}
        {VERB_HOURS.map((v, i) => {
          const x = ml + i * slot + (slot - barW) / 2;
          const topY = yOf(v.hours);
          const full = baseline - topY;
          return (
            <g key={v.verb} data-dim={active !== null && active !== i ? "true" : undefined} className="dc-bars__col">
              <rect
                x={x}
                y={inView ? topY : baseline}
                width={barW}
                height={inView ? full : 0}
                fill={blueFor(i, n)}
                className="dc-bars__bar"
                style={{ transitionDelay: `${i * 26}ms` }}
                onMouseEnter={(e) => {
                  setActive(i);
                  const p = tipPos(e);
                  setTip({ x: p.x, y: p.y, title: v.verb, line: `${v.hours.toFixed(2)} h`, swatch: blueFor(i, n) });
                }}
                onMouseMove={(e) => setTip((t) => (t ? { ...t, ...tipPos(e) } : t))}
              />
              <text
                className="dc-bars__xtick"
                transform={`translate(${x + barW / 2} ${baseline + 6}) rotate(-75)`}
                textAnchor="end"
                dominantBaseline="central"
              >
                {v.verb}
              </text>
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
}
