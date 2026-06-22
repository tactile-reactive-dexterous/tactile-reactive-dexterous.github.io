"use client";

import { Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORY_DURATION, VERB_HOURS, OBJECT_BARS, OBJECT_CAT_SPANS } from "@/data/trex";
import { useInView } from "@/lib/useInView";

// Interactive SVG re-creations of the original matplotlib pie / verb-hours bar
// charts (same data, same layout: % labels on the wedges + compact right-hand
// legend; bars on a 0–6 h axis with a vertical "Hours (h)" label and rotated
// tick labels). Slices and bars brighten on hover and surface a tooltip.

const TOTAL_HOURS = CATEGORY_DURATION.reduce((s, c) => s + c.hours, 0);

type Tip = { x: number; y: number; flipX?: boolean; title: string; line: string; swatch: string } | null;

function Tooltip({ tip }: { tip: Tip }) {
  if (!tip) return null;
  return (
    <div
      className="dc-tip"
      style={{ left: tip.x, top: tip.y, transform: `translate(${tip.flipX ? "-100%" : "0"}, -100%)` }}
      role="status"
    >
      <div className="dc-tip__title">{tip.title}</div>
      <div className="dc-tip__row">
        <i style={{ background: tip.swatch }} /> {tip.line}
      </div>
    </div>
  );
}

// Position the tooltip relative to the chart box; near the right edge it grows
// leftward (flipX) so it never spills past the right side (e.g. the unscrew bar).
function tipPos(e: React.MouseEvent) {
  const box = (e.currentTarget.closest(".dc-chart") as HTMLElement).getBoundingClientRect();
  const rx = e.clientX - box.left;
  const ry = e.clientY - box.top;
  const flipX = rx > box.width - 180;
  return { x: flipX ? rx - 14 : rx + 14, y: ry + 14, flipX };
}

// Round every coordinate written into an SVG attribute to a fixed precision so
// the server-rendered string and the client-rendered string are byte-identical
// (raw Math.cos/sin/division differ in their last float digit between the SSR
// and browser passes, which would trigger a React hydration mismatch).
const r3 = (n: number) => Math.round(n * 1000) / 1000;

// --- Pie: demonstration time per task category -----------------------------
function polar(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: r3(cx + r * Math.cos(a)), y: r3(cy + r * Math.sin(a)) };
}
function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
}

function PieChart() {
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
      <svg
        viewBox="0 0 260 260"
        className="dc-pie__svg"
        role="img"
        aria-label="Demonstration time per task category"
        onMouseLeave={() => { setActive(null); setTip(null); }}
      >
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
                    setTip({ ...p, title: s.name, line: `${s.hours.toFixed(2)} h · ${s.pct.toFixed(1)}%`, swatch: s.color });
                  }}
                  onMouseMove={(e) => { const p = tipPos(e); setTip((t) => (t ? { ...t, ...p } : t)); }}
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

// --- Click-to-enlarge wrapper ----------------------------------------------
// Renders the chart inline plus an "enlarge" button; clicking opens a centred
// modal that grows out of the chart's original on-page position (FLIP-style
// transform) and holds a FRESH chart instance — so all hover/tooltip
// interactions keep working at the larger size.
function Expandable({ label, render }: { label: string; render: () => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false); // drives the open/close transition
  const [from, setFrom] = useState({ dx: 0, dy: 0, s: 0.4 });
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openModal = () => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (rect) {
      setFrom({
        dx: rect.left + rect.width / 2 - window.innerWidth / 2,
        dy: rect.top + rect.height / 2 - window.innerHeight / 2,
        s: Math.max(0.22, Math.min(0.6, rect.width / 760)),
      });
    }
    setOpen(true);
    setShown(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };
  const close = () => {
    setShown(false);
    window.setTimeout(() => setOpen(false), 280);
  };

  return (
    <div className="dc-frame" ref={frameRef}>
      {render()}
      <button className="dc-expand-btn" onClick={openModal} aria-label={`Enlarge ${label}`} type="button">
        <Maximize2 size={15} strokeWidth={1.8} aria-hidden="true" />
      </button>
      {open && mounted
        ? createPortal(
            <div className="dc-modal" data-open={shown ? "true" : undefined} onClick={close} role="presentation">
              <div
                className="dc-modal__inner"
                onClick={(e) => e.stopPropagation()}
                style={{
                  transform: shown
                    ? "translate(0px, 0px) scale(1)"
                    : `translate(${from.dx}px, ${from.dy}px) scale(${from.s})`,
                  opacity: shown ? 1 : 0.4,
                }}
              >
                <button className="dc-modal__close" onClick={close} aria-label="Close" type="button">
                  <X size={20} strokeWidth={1.9} aria-hidden="true" />
                </button>
                {render()}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export function CategoryPie() {
  return <Expandable label="task-category share" render={() => <PieChart />} />;
}

// --- Bars: demonstration hours per motion primitive ------------------------
// Blue gradient: darkest for the tallest bar, lightest for the shortest
// (matplotlib Blues 0.7 -> 0.3).
function blueFor(i: number, n: number) {
  const t = n > 1 ? i / (n - 1) : 0;
  return `hsl(212 64% ${34 + t * 46}%)`;
}

function BarsChart() {
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
  const yOf = (h: number) => r3(baseline - (h / axisMax) * plotH);
  const slot = plotW / n;
  const barW = r3(slot * 0.66);

  return (
    <div className="dc-chart dc-bars" ref={ref} onMouseLeave={() => { setActive(null); setTip(null); }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="dc-bars__svg"
        role="img"
        aria-label="Demonstration hours per motion primitive"
        onMouseLeave={() => { setActive(null); setTip(null); }}
      >
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
          const x = r3(ml + i * slot + (slot - barW) / 2);
          const topY = yOf(v.hours);
          const full = r3(baseline - topY);
          const xMid = r3(x + barW / 2);
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
                  setTip({ ...p, title: v.verb, line: `${v.hours.toFixed(2)} h`, swatch: blueFor(i, n) });
                }}
                onMouseMove={(e) => { const p = tipPos(e); setTip((t) => (t ? { ...t, ...p } : t)); }}
              />
              <text
                className="dc-bars__xtick"
                transform={`translate(${xMid} ${baseline + 6}) rotate(-75)`}
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

export function VerbBars() {
  return <Expandable label="motion-primitive hours" render={() => <BarsChart />} />;
}

// --- Long-tail bars: episodes per object, grouped & coloured by category -----
// Same data / order / colours as object_frequency_chart.png (210 objects, log
// y-axis, category background bands). Hovering a bar surfaces its object name,
// episode count, and category — matching the top-right VerbBars interaction.
const OBJ_LOG_MIN = Math.log10(0.8);     // axis bottom (just below 1 so count=1 shows a sliver)
const OBJ_LOG_MAX = Math.log10(820);     // headroom = max count (82) × 10, like the figure

// Darken a category hex toward black so the band label stays readable on white.
function darken(hex: string, f = 0.42) {
  const h = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * (1 - f)));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function ObjectBarsChart() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<Tip>(null);

  const n = OBJECT_BARS.length;
  const W = 1400;
  const H = 240;  // flatter chart (shorter bars)
  const ml = 50;  // left margin (y-axis + label)
  const mr = 8;
  const mt = 10;  // small top margin (category labels sit INSIDE the bands)
  const mb = 60;  // bottom margin: just fits the rotated per-object labels (no extra white gap)
  const plotW = W - ml - mr;
  const plotH = H - mt - mb;
  const baseline = mt + plotH;
  const yOf = (c: number) =>
    r3(baseline - ((Math.log10(Math.max(0.8, c)) - OBJ_LOG_MIN) / (OBJ_LOG_MAX - OBJ_LOG_MIN)) * plotH);
  const slot = plotW / n;
  const barW = r3(slot * 0.82);
  const catOf = (i: number) => OBJECT_CAT_SPANS.find((s) => i >= s.start && i <= s.end)?.cat ?? "";

  return (
    <div className="dc-chart dc-bars dc-objbars" ref={ref} onMouseLeave={() => { setActive(null); setTip(null); }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="dc-bars__svg"
        role="img"
        aria-label="Episodes per object, grouped by category"
        onMouseLeave={() => { setActive(null); setTip(null); }}
      >
        {/* category background bands + labels */}
        {OBJECT_CAT_SPANS.map((sp) => {
          const x0 = r3(ml + sp.start * slot);
          const x1 = r3(ml + (sp.end + 1) * slot);
          return (
            <g key={sp.cat}>
              <rect x={x0} y={mt} width={r3(x1 - x0)} height={r3(baseline - mt)} fill={sp.color} opacity={0.12} />
              <text
                x={r3((x0 + x1) / 2)}
                y={r3(mt + plotH * 0.2)}
                textAnchor="middle"
                fill={darken(sp.color)}
                style={{ fontSize: 10.5, fontWeight: 700 }}
              >
                {sp.cat}
              </text>
            </g>
          );
        })}
        {/* y grid + ticks (log: 1, 10, 100) */}
        {[0, 1, 2].map((exp) => {
          const g = 10 ** exp;
          return (
            <g key={exp}>
              <line x1={ml} y1={yOf(g)} x2={W - mr} y2={yOf(g)} className="dc-bars__grid" />
              <text x={ml - 7} y={yOf(g)} className="dc-bars__ytick" textAnchor="end" dominantBaseline="central">
                10<tspan dy={-4} style={{ fontSize: "72%" }}>{exp}</tspan>
              </text>
            </g>
          );
        })}
        {/* axes */}
        <line x1={ml} y1={mt} x2={ml} y2={baseline} className="dc-bars__axis" />
        <line x1={ml} y1={baseline} x2={W - mr} y2={baseline} className="dc-bars__axis" />
        <text className="dc-bars__ytitle" transform={`translate(13 ${mt + plotH / 2}) rotate(-90)`} textAnchor="middle">
          # Episodes (log scale)
        </text>
        {/* bars */}
        {OBJECT_BARS.map((o, i) => {
          const x = r3(ml + i * slot + (slot - barW) / 2);
          const xMid = r3(x + barW / 2);
          const topY = yOf(o.count);
          const full = r3(baseline - topY);
          return (
            <g key={o.name} data-dim={active !== null && active !== i ? "true" : undefined} className="dc-bars__col">
              <rect
                x={x}
                y={inView ? topY : baseline}
                width={barW}
                height={inView ? full : 0}
                fill={o.color}
                className="dc-bars__bar"
                style={{ transitionDelay: `${Math.min(i * 6, 700)}ms` }}
                onMouseEnter={(e) => {
                  setActive(i);
                  const p = tipPos(e);
                  setTip({ ...p, title: o.label, line: `${o.count} episode${o.count === 1 ? "" : "s"} · ${catOf(i)}`, swatch: o.color });
                }}
                onMouseMove={(e) => { const p = tipPos(e); setTip((t) => (t ? { ...t, ...p } : t)); }}
              />
              <text
                className="dc-objbars__xtick"
                transform={`translate(${xMid} ${baseline + 4}) rotate(-90)`}
                textAnchor="end"
                dominantBaseline="central"
              >
                {o.label}
              </text>
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
}

export function ObjectFrequencyBars() {
  return <Expandable label="episodes per object" render={() => <ObjectBarsChart />} />;
}
