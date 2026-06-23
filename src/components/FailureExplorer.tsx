"use client";

import { useState } from "react";
import ZoomableImage from "@/components/ZoomableImage";
import { FAILURE_CASES } from "@/data/trex";

// Interactive failure-case explorer: the six mode cards act as a selector;
// hovering / clicking one crops the full fail_case figure to that mode's row.
// Click the strip to open the whole figure in the lightbox.
//
// ↓↓ 裁剪参数（每个失败模式对应原图 fail_case.jpg 里的一行）：
//    top / bottom 是该行在原图中的【上边界 / 下边界】像素（原图 2101×2076）。
//    上面裁多了就把 top 调小；下面裁多了就把 bottom 调小。顺序对应卡片 1–6。
const IMG_W = 2101;
const IMG_H = 2076;
const ROWS = [
  { top: 71, bottom: 405 },    // 1 Object collision — Screw lightbulb
  { top: 405, bottom: 741 },   // 2 Slipping off — Open lock
  { top: 742, bottom: 1069 },  // 3 Imprecise position — Transfer egg
  { top: 1070, bottom: 1407 }, // 4 Multi-finger friction — Sort mahjong
  { top: 1407, bottom: 1742 }, // 5 Excessive force — Apply toothpaste
  { top: 1742, bottom: 2079 }, // 6 Sliding misalignment — Extract card
];

export default function FailureExplorer() {
  const [active, setActive] = useState(0);
  const f = FAILURE_CASES[active];
  const row = ROWS[active];

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
            <p>{c.text}</p>
          </button>
        ))}
      </div>

      <figure className="trex-figure fail-stage">
        <div className="fail-stage__bar">
          Execution Progress
          <span className="fail-stage__arrow" aria-hidden="true" />
        </div>
        {/* The full figure is cropped to the active row by a fixed-aspect window
            (overflow hidden) + a vertical shift; clicking opens the whole figure. */}
        <div className="fail-stage__viewer" style={{ aspectRatio: `${IMG_W} / ${row.bottom - row.top}` }}>
          {/* inner wrapper scales the content down a touch so there's even white
              padding inside the (unchanged) frame — tune scale() below. */}
          <div className="fail-stage__crop">
            <ZoomableImage
              className="fail-stage__img"
              src="/figures/fail_case.jpg"
              alt={`${f.task} failure rollout — ${f.mode}`}
              width={IMG_W}
              height={IMG_H}
              style={{ transform: `translateY(-${((row.top / IMG_H) * 100).toFixed(3)}%)` }}
            />
          </div>
        </div>
        <figcaption>
          <strong>{f.mode}</strong> — {f.task}. The red box marks the contact issue behind the failure. Hover a card
          above to switch modes; click the strip to enlarge.
        </figcaption>
      </figure>
    </div>
  );
}
