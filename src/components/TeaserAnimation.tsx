"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Animated teaser: the whole figure starts as a very pale, washed-out colour
// (as if a ~60% white cloth lies over it), then each region lights up to full
// colour in sequence. Implemented as full-colour copies of teaser.png clipped
// to each region, fading in over a low-opacity base — so it stays perfectly
// aligned with the figure without reconstructing every element.
const SRC = "/figures/teaser.png";

// clip-path inset(top right bottom left), as % of the figure. Tuned to the
// teaser.png layout (Human Egocentric | T-Rex Model {Latent+Action / Tactile} /
// T-Rex Dataset | Post-training Tasks).
const REGIONS = [
  { name: "Human egocentric pre-training", clip: "inset(0% 77.5% 0% 0%)" },
  { name: "Latent + Action experts — slow visuomotor planning", clip: "inset(0% 40.6% 48% 22%)" },
  { name: "T-Rex Dataset — tactile-rich mid-training", clip: "inset(51.9% 21.2% 0% 21%)" },
  { name: "Tactile expert — fast tactile refinement", clip: "inset(0% 21.2% 48% 58.4%)" },
  { name: "Post-training tasks — contact-rich skills", clip: "inset(0% 0% 0% 77.6%)" },
];
const N = REGIONS.length;
const DURATION = 7000; // ms for the bar to fill 0 -> 100%, then stop (no auto-replay)

export default function TeaserAnimation() {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (paused) return;
    let raf = 0;
    const start = performance.now() - progressRef.current * DURATION;
    const tick = (t: number) => {
      const raw = Math.min(1, (t - start) / DURATION);
      setProgress(raw);
      if (raw >= 1) {
        setPaused(true); // play once to 100%, then stop — no auto-replay
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [paused]);

  const lit = (i: number) => progress >= (i + 1) / N - 0.0001;
  let activeIdx = -1;
  for (let i = 0; i < N; i++) if (lit(i)) activeIdx = i;
  const caption = activeIdx < 0 ? "The full T-Rex pipeline — watch each stage light up." : REGIONS[activeIdx].name;

  return (
    <figure className="trex-figure">
      <div className="trex-fig-controls">
        <button className="trex-btn" onClick={() => setPaused((p) => !p)} type="button">
          {paused ? <Play size={14} /> : <Pause size={14} />} {paused ? "Play" : "Pause"}
        </button>
        <button
          className="trex-btn"
          onClick={() => { progressRef.current = 0; setProgress(0); setPaused(false); }}
          type="button"
        >
          <RotateCcw size={13} /> Replay
        </button>
        <input
          aria-label="Teaser animation progress"
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

      <div className="teaser-anim">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="teaser-anim__base" src={SRC} alt="T-Rex overview" />
        {/* One full-colour copy per region, clipped to that region and faded in
            when lit. All layers fill the exact same box (object-fit:fill on the
            fixed-aspect container) so they are pixel-identical — overlapping
            copies don't double, and each region gently brightens from pale. */}
        {REGIONS.map((r, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            className="teaser-anim__region"
            src={SRC}
            alt=""
            aria-hidden="true"
            style={{ clipPath: r.clip, WebkitClipPath: r.clip, opacity: lit(i) ? 1 : 0 }}
          />
        ))}
      </div>

      <div className="teaser-anim__beat">{caption}</div>

      <figcaption>
        Figure 1: T-Rex overview — large-scale human egocentric pre-training plus tactile-grounded robot mid-training, a
        Mixture-of-Transformer model with a spatio-temporal tactile encoder, and a 100-hour tactile-rich dataset spanning
        12 manipulation tasks.
      </figcaption>
    </figure>
  );
}
