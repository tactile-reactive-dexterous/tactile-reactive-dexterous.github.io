"use client";

import { ABLATIONS, RESULTS_AVG, RESULTS_TABLE, TASK_COLUMNS } from "@/data/trex";
import { useInView } from "@/lib/useInView";

const CAT_COLOR: Record<string, string> = {
  force: "var(--trex-slow)",
  deform: "var(--trex-gold)",
  bimanual: "var(--trex-fast)",
};

// Animated horizontal bar chart of macro-average success. Bars grow in from 0
// when the chart first scrolls into view.
export function ResultsBars({ figureNumber }: { figureNumber: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const max = 70; // headroom above T-Rex's 65

  return (
    <figure className="trex-figure" ref={ref}>
      <div className="rc-bars">
        {RESULTS_AVG.map((m, i) => (
          <div className="rc-bar-row" key={m.method}>
            <div className="rc-bar-name">{m.highlight ? <b>{m.method}</b> : m.method}</div>
            <div className="rc-bar-track">
              <div
                className="rc-bar-fill"
                data-highlight={m.highlight ? "true" : undefined}
                style={{
                  width: inView ? `${(m.avg / max) * 100}%` : "0%",
                  transitionDelay: `${i * 90}ms`,
                }}
              />
              <span className="rc-bar-val">{m.avg}%</span>
            </div>
          </div>
        ))}
      </div>
      <p className="rc-gap-note">
        T-Rex reaches a <b>65% macro-average</b> — <b>+30 absolute points</b> over the strongest baseline (EgoScale,
        35%), and over 20× the weakest, across all 12 tactile-reactive tasks.
      </p>
      <figcaption>
        Figure {figureNumber}: Average success rate (%) across the 12 tactile-reactive manipulation tasks, averaged over
        16 rollouts per task. T-Rex is best on <b>every</b> task.
      </figcaption>
    </figure>
  );
}

// Per-task success table. Each numeric cell fades a soft category-tinted bar
// proportional to its value when the table enters view; the T-Rex row is gold.
export function ResultsTable({ figureNumber }: { figureNumber: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.18);

  return (
    <figure className="trex-figure" ref={ref}>
      <div className="rc-table-wrap">
        <table className="rc-table">
          <thead>
            <tr>
              <th>Method</th>
              {TASK_COLUMNS.map((c) => (
                <th key={c.key} style={{ borderTop: `3px solid ${CAT_COLOR[c.cat]}` }}>
                  {c.label}
                </th>
              ))}
              <th>Avg</th>
            </tr>
          </thead>
          <tbody>
            {RESULTS_TABLE.map((row) => (
              <tr key={row.method} className={row.ours ? "is-ours" : undefined}>
                <td>{row.method}</td>
                {row.vals.map((v, i) => (
                  <td className="rc-cell" key={i}>
                    <span
                      className="rc-cell__bg"
                      style={{
                        background: `${CAT_COLOR[TASK_COLUMNS[i].cat]}`,
                        opacity: inView ? Math.min(0.32, (v / 100) * 0.5) : 0,
                        transitionDelay: `${i * 22}ms`,
                      }}
                    />
                    <span style={{ position: "relative" }}>{v}</span>
                  </td>
                ))}
                <td>{row.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rc-legend">
        <span><i style={{ background: "var(--trex-slow)" }} /> Force-sensitive contact</span>
        <span><i style={{ background: "var(--trex-gold)" }} /> Deformation-aware</span>
        <span><i style={{ background: "var(--trex-fast)" }} /> Bimanual force–deformation</span>
      </div>
      <figcaption>
        Figure {figureNumber}: Per-task success rate (%). The bottom row is T-Rex; the right-most column is the
        macro-average across all 12 tasks.
      </figcaption>
    </figure>
  );
}

// Compact animated ablation bars (3 ablation studies, averages over the 6
// representative tasks).
export function AblationBars({ figureNumber }: { figureNumber: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const max = 70;

  return (
    <figure className="trex-figure" ref={ref}>
      <div className="abl-grid">
        {ABLATIONS.map((group) => (
          <div className="abl-block" key={group.title}>
            <h4>{group.title}</h4>
            {group.rows.map((r, i) => (
              <div className="abl-row" key={r.name}>
                <span className="abl-name">{r.name}</span>
                <div className="abl-track">
                  <div
                    className="abl-fill"
                    data-full={r.full ? "true" : undefined}
                    style={{ width: inView ? `${(r.avg / max) * 100}%` : "0%", transitionDelay: `${i * 80}ms` }}
                  />
                </div>
                <span className="abl-val">{r.avg}</span>
              </div>
            ))}
            {group.note ? <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--trex-muted)" }}>{group.note}</p> : null}
          </div>
        ))}
      </div>
      <figcaption>
        Figure {figureNumber}: Ablations (average success over 6 representative tasks). Tactile feedback, the temporal
        VQ-VAE encoder, the asynchronous cascade, and both training stages each contribute.
      </figcaption>
    </figure>
  );
}
