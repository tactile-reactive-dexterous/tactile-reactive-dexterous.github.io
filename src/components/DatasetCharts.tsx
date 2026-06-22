"use client";

import { useState } from "react";
import { CATEGORY_DURATION, VERB_HOURS } from "@/data/trex";
import { useInView } from "@/lib/useInView";

// Interactive replacements for the static pie / verb-hours PNGs: SVG charts
// whose slices and bars brighten on hover and surface a floating tooltip
// (name + hours + share), mirroring the hover behaviour of the results chart.

const TOTAL_HOURS = CATEGORY_DURATION.reduce((s, c) => s + c.hours, 0);

type Tip = { x: number; y: number; title: string; lines: string[]; swatch: string } | null;

function Tooltip({ tip }: { tip: Tip }) {
  if (!tip) return null;
  return (
    <div className="dc-tip" style={{ left: tip.x, top: tip.y }} role="status">
      <div className="dc-tip__title">{tip.title}</div>
      {tip.lines.map((l) => (
        <div className="dc-tip__row" key={l}>
          <i style={{ background: tip.swatch }} /> {l}
        </div>
      ))}
    </div>
  );
}

// --- Pie: demonstration time per task category -----------------------------
function polar(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, end);
  const e = polar(cx, cy, r, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y} Z`;
}

export function CategoryPie() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip>(null);
  const cx = 130;
  const cy = 130;
  const r = 118;

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
      onMouseMove={(e) => {
        if (active === null) return;
        const box = e.currentTarget.getBoundingClientRect();
        setTip((t) => (t ? { ...t, x: e.clientX - box.left + 14, y: e.clientY - box.top + 14 } : t));
      }}
      onMouseLeave={() => {
        setActive(null);
        setTip(null);
      }}
    >
      <svg viewBox="0 0 260 260" className="dc-pie__svg" role="img" aria-label="Demonstration time per task category">
        <g style={{ transform: inView ? "scale(1)" : "scale(0.6)", opacity: inView ? 1 : 0 }} className="dc-pie__g">
          {slices.map((s, i) => {
            const mid = (s.start + s.end) / 2;
            const pop = active === i ? polar(0, 0, 7, mid) : { x: 0, y: 0 };
            return (
              <path
                key={s.name}
                d={arcPath(cx, cy, r, s.start, s.end)}
                fill={s.color}
                stroke="#fff"
                strokeWidth={2}
                className="dc-pie__slice"
                data-dim={active !== null && active !== i ? "true" : undefined}
                style={{ transform: `translate(${pop.x}px, ${pop.y}px)` }}
                onMouseEnter={(e) => {
                  setActive(i);
                  const box = (e.currentTarget.closest(".dc-chart") as HTMLElement).getBoundingClientRect();
                  setTip({
                    x: e.clientX - box.left + 14,
                    y: e.clientY - box.top + 14,
                    title: s.name,
                    lines: [`${s.hours.toFixed(2)} h · ${s.pct.toFixed(1)}%`],
                    swatch: s.color,
                  });
                }}
              />
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
const MAX_HOURS = Math.max(...VERB_HOURS.map((v) => v.hours));
// Blue gradient: darkest for the tallest bar, lightest for the shortest.
function blueFor(i: number, n: number) {
  const t = n > 1 ? i / (n - 1) : 0; // 0 = tallest
  const light = 38 + t * 40; // 38% -> 78% lightness
  return `hsl(210 65% ${light}%)`;
}

export function VerbBars() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip>(null);
  const n = VERB_HOURS.length;

  return (
    <div
      className="dc-chart dc-bars"
      ref={ref}
      onMouseLeave={() => {
        setActive(null);
        setTip(null);
      }}
    >
      <div className="dc-bars__plot">
        <div className="dc-bars__yaxis" aria-hidden="true">
          {[6, 4, 2, 0].map((g) => (
            <span key={g} style={{ bottom: `${(g / 6) * 100}%` }}>
              {g}
            </span>
          ))}
        </div>
        <div className="dc-bars__cols">
          {VERB_HOURS.map((v, i) => (
            <div
              className="dc-bars__col"
              key={v.verb}
              data-dim={active !== null && active !== i ? "true" : undefined}
              onMouseEnter={(e) => {
                setActive(i);
                const box = (e.currentTarget.closest(".dc-chart") as HTMLElement).getBoundingClientRect();
                const cb = e.currentTarget.getBoundingClientRect();
                setTip({
                  x: cb.left - box.left + cb.width / 2,
                  y: cb.top - box.top - 6,
                  title: v.verb,
                  lines: [`${v.hours.toFixed(2)} h`],
                  swatch: blueFor(i, n),
                });
              }}
            >
              <div className="dc-bars__bar-wrap">
                <div
                  className="dc-bars__bar"
                  style={{
                    height: inView ? `${(v.hours / (MAX_HOURS * 1.05)) * 100}%` : "0%",
                    background: blueFor(i, n),
                    transitionDelay: `${i * 28}ms`,
                  }}
                />
              </div>
              <span className="dc-bars__label">{v.verb}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="dc-bars__ytitle">Hours (h)</div>
      <Tooltip tip={tip} />
    </div>
  );
}
