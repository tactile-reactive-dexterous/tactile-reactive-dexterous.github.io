"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

// Animated teaser: the whole figure starts pale; then each region lights up
// (returns to full colour) in sequence. Implemented as full-colour copies of
// teaser.png clipped to each region, fading in over a desaturated base — so it
// stays perfectly aligned with the figure without reconstructing every element.
const SRC = "/figures/teaser.png";

// clip-path inset(top right bottom left), as % of the figure. Tuned to the
// teaser.png layout (Human Egocentric | T-Rex Model {Latent+Action / Tactile} /
// T-Rex Dataset | Post-training Tasks).
const REGIONS = [
  { name: "Human egocentric pre-training", clip: "inset(2.5% 78.8% 2.5% 1.5%)" },
  { name: "Latent + Action experts — slow visuomotor planning", clip: "inset(2.5% 41% 51.5% 22.3%)" },
  { name: "T-Rex Dataset — tactile-rich mid-training", clip: "inset(49% 22.5% 2.5% 22.3%)" },
  { name: "Tactile expert — fast tactile refinement", clip: "inset(2.5% 22.5% 51.5% 59.1%)" },
  { name: "Post-training tasks — contact-rich skills", clip: "inset(2.5% 1.5% 2.5% 78.5%)" },
];
const STEPS = REGIONS.length;
const TICK_MS = 1300;

export default function TeaserAnimation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((s) => (s >= STEPS ? 0 : s + 1)), TICK_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  const caption =
    step === 0 ? "The full T-Rex pipeline — watch each stage light up." : REGIONS[step - 1].name;

  return (
    <figure className="trex-figure">
      <div className="trex-fig-controls">
        <button className="trex-btn" onClick={() => setPlaying((p) => !p)} type="button">
          {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "Pause" : "Play"}
        </button>
        <button className="trex-btn" onClick={() => { setStep(0); setPlaying(true); }} type="button">
          <RotateCcw size={13} /> Replay
        </button>
        <input
          aria-label="Teaser animation step"
          className="trex-range"
          type="range"
          min={0}
          max={STEPS}
          step={1}
          value={step}
          onChange={(e) => { setPlaying(false); setStep(Number(e.currentTarget.value)); }}
        />
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{step}/{STEPS}</span>
      </div>

      <div className="teaser-anim">
        {/* pale base */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="teaser-anim__base" src={SRC} alt="T-Rex overview" />
        {/* full-colour region reveals */}
        {REGIONS.map((r, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            className="teaser-anim__region"
            src={SRC}
            alt=""
            aria-hidden="true"
            style={{ clipPath: r.clip, WebkitClipPath: r.clip, opacity: step > i ? 1 : 0 }}
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
