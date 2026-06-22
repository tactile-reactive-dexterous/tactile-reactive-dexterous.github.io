"use client";

import { useState } from "react";
import ZoomableImage from "@/components/ZoomableImage";
import { FAILURE_CASES } from "@/data/trex";

// Interactive failure-case explorer: the six mode cards act as a selector;
// hovering / clicking one swaps the viewer to that mode's execution filmstrip
// (a row cropped from the original fail_case figure). Click the strip to
// enlarge it in the lightbox. Card order matches the figure rows 1–6.
const ROW_HEIGHTS = [345, 271, 323, 281, 271, 258];

export default function FailureExplorer() {
  const [active, setActive] = useState(0);
  const f = FAILURE_CASES[active];

  return (
    <div className="fail-explorer">
      <div className="fail-grid fail-grid--interactive">
        {FAILURE_CASES.map((c, i) => (
          <button
            key={c.mode}
            className="fail-card"
            data-active={i === active ? "true" : undefined}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            type="button"
          >
            <h4>{c.mode}</h4>
            <p><strong>{c.task}.</strong> {c.text}</p>
          </button>
        ))}
      </div>

      <figure className="trex-figure fail-stage">
        <div className="fail-stage__bar">
          Execution Progress
          <span className="fail-stage__arrow" aria-hidden="true" />
        </div>
        <ZoomableImage
          key={active}
          className="fail-stage__img"
          src={`/figures/failcases/row${active + 1}.png`}
          alt={`${f.task} failure rollout — ${f.mode}`}
          width={2101}
          height={ROW_HEIGHTS[active]}
        />
        <figcaption>
          <strong>{f.mode}</strong> — {f.task}. The red box marks the contact issue behind the failure. Hover a card
          above to switch modes; click the strip to enlarge.
        </figcaption>
      </figure>
    </div>
  );
}
