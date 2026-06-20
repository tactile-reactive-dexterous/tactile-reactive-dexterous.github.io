"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

// Animated Mixture-of-Transformer-Experts (MoT) architecture diagram for T-Rex.
// Replaces a static figure: a stepped, auto-playing storyboard tells the
// "two clocks" story — a SLOW visuomotor stream (top, cool/blue) that plans once
// per action chunk, and a FAST tactile stream (bottom, warm/orange) that refines
// the action 4x as often. Play/pause + a step scrubber let the reader drive it.

const VB_W = 1040;
const VB_H = 600;

const BEATS: { title: string; body: ReactNode }[] = [
  { title: "Two clocks", body: <>Contact-rich dexterity needs two clocks: a <b>slow</b> visuomotor planner and a <b>fast</b> tactile refiner, fused in one Mixture-of-Transformer.</> },
  { title: "Inputs", body: <>Vision + language enter the <b>slow</b> path (top); high-frequency tactile force, instantaneous force, and the deformation map enter the <b>fast</b> path (bottom).</> },
  { title: "Slow encoding", body: <>The VLM tower encodes vision &amp; language; the <b>latent expert</b> predicts future visual representations and feeds the <b>action expert</b> through shared self-attention.</> },
  { title: "Slow denoising — 6 steps", body: <>The action expert denoises the action chunk from noise (τ = 1) down to the split point <b>τ = 0.4</b> in 6 flow-matching steps — a coarse base plan x̂.</> },
  { title: "Freeze the context", body: <>The vision-language + action KV are cached as a <b>frozen</b> context (KV@0.4). The heavy slow experts now go quiet — they do <b>not</b> run again this chunk.</> },
  { title: "Tactile encoding", body: <>Force history collapses through the <b>temporal VQ-VAE</b> to one token per finger; instantaneous force and the frozen deformation encoder add the rest → tactile tokens z.</> },
  { title: "Fast denoising — 4 steps", body: <>The lightweight <b>tactile expert</b> clones the cache and finishes τ = 0.4 → 0 in 4 cheap steps, conditioned on live touch — producing the executable action chunk.</> },
  { title: "4 fast ticks per slow tick", body: <>That fast pass re-fires at chunk offsets {"{0, 4, 8, 12}"} on fresh tactile signals — <b>4 tactile reactions per visuomotor plan</b>, so per-step cost is just 4 light steps.</> },
  { title: "Act at 300 Hz", body: <>The refined 62-dim × 16 action chunk drives the 300 Hz low-level controller on the bimanual dexterous hands — closed-loop reaction at the speed of contact.</> },
];

// flow timeline geometry (left = τ=1 noise, right = τ=0 clean; split at 0.6)
const FX_L = 372;
const FX_R = 902;
const FY = 548;
const SPLIT = 0.6;
const splitX = FX_L + SPLIT * (FX_R - FX_L);

function markerFrac(beat: number) {
  if (beat < 3) return 0;
  if (beat < 6) return SPLIT;
  return 1;
}

function Box({
  x, y, w, h, variant, title, sub, tag, reveal, dim, frozen,
}: {
  x: number; y: number; w: number; h: number;
  variant?: "slow" | "fast" | "mot";
  title?: string; sub?: string; tag?: string;
  reveal: boolean; dim?: boolean; frozen?: boolean;
}) {
  const cls = ["arch-node", dim ? "arch-dimmed" : "", frozen ? "arch-frozen" : ""].filter(Boolean).join(" ");
  const boxCls = ["arch-box", variant === "slow" ? "arch-box--slow" : variant === "fast" ? "arch-box--fast" : variant === "mot" ? "arch-box--mot" : ""].filter(Boolean).join(" ");
  return (
    <g className={cls} style={{ opacity: reveal ? 1 : 0.12 }}>
      <rect className={boxCls} x={x} y={y} width={w} height={h} rx={10} />
      {tag ? <text className={`arch-tag ${variant === "fast" ? "arch-tag--fast" : "arch-tag--slow"}`} x={x + 10} y={y + 16}>{tag}</text> : null}
      {title ? <text className="arch-label" x={x + w / 2} y={y + h / 2 + (sub ? -3 : 5)} textAnchor="middle">{title}</text> : null}
      {sub ? <text className="arch-sub" x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle">{sub}</text> : null}
    </g>
  );
}

function Arrow({ d, kind, reveal, dashed }: { d: string; kind: "slow" | "fast" | "ink"; reveal: boolean; dashed?: boolean }) {
  return (
    <path
      className={`arch-flowline arch-arrow-${kind}`}
      d={d}
      markerEnd={`url(#arch-head-${kind})`}
      strokeDasharray={dashed ? "5 5" : undefined}
      style={{ opacity: reveal ? 0.9 : 0.1, transition: "opacity 0.5s ease" }}
    />
  );
}

export default function ArchitectureFigure({ figureNumber }: { figureNumber: number }) {
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setBeat((b) => (b + 1) % BEATS.length), 2900);
    return () => window.clearInterval(id);
  }, [playing]);

  const frac = markerFrac(beat);
  const markerX = FX_L + frac * (FX_R - FX_L);

  const slowDim = beat >= 4; // frozen after cache snapshot
  const showInputs = beat >= 1;
  const showSlowEnc = beat >= 2;
  const showXhat = beat >= 3;
  const showCache = beat >= 4;
  const showTactile = beat >= 5;
  const showOut = beat >= 6;
  const showCtrl = beat >= 8;

  return (
    <figure className="trex-figure arch-fig">
      <div className="trex-fig-controls">
        <button className="trex-btn" onClick={() => setPlaying((p) => !p)} type="button">
          {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "Pause" : "Play"}
        </button>
        <button className="trex-btn" onClick={() => { setBeat(0); setPlaying(true); }} type="button">
          <RotateCcw size={13} /> Replay
        </button>
        <input
          aria-label="Architecture animation step"
          className="trex-range"
          type="range"
          min={0}
          max={BEATS.length - 1}
          step={1}
          value={beat}
          onChange={(e) => { setPlaying(false); setBeat(Number(e.currentTarget.value)); }}
        />
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{beat + 1}/{BEATS.length}</span>
      </div>

      <div className="arch-stage">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label="T-Rex Mixture-of-Transformer architecture animation">
          <defs>
            {(["slow", "fast", "ink"] as const).map((k) => (
              <marker key={k} id={`arch-head-${k}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={k === "slow" ? "var(--trex-slow)" : k === "fast" ? "var(--trex-fast)" : "var(--trex-line-strong)"} />
              </marker>
            ))}
          </defs>

          {/* band labels */}
          <text className="arch-tag arch-tag--slow" x={24} y={42}>Slow · visuomotor · 1 tick / chunk</text>
          <text className="arch-tag arch-tag--fast" x={24} y={524}>Fast · tactile · 4 ticks / chunk</text>

          {/* ---- arrows (under boxes) ---- */}
          {/* slow inputs -> VLM */}
          <Arrow kind="slow" reveal={showSlowEnc} d="M 174 92 L 198 100" />
          <Arrow kind="slow" reveal={showSlowEnc} d="M 174 140 L 198 132" />
          {/* VLM -> latent (into MoT) */}
          <Arrow kind="slow" reveal={showSlowEnc} d="M 330 115 L 382 119" />
          {/* latent -> action */}
          <Arrow kind="slow" reveal={showSlowEnc} d="M 534 156 L 534 168" />
          {/* fast inputs -> encoders */}
          <Arrow kind="fast" reveal={showTactile} d="M 174 378 L 198 380" />
          <Arrow kind="fast" reveal={showTactile} d="M 174 424 L 198 424" />
          <Arrow kind="fast" reveal={showTactile} d="M 174 468 L 198 468" />
          {/* encoders -> z_t */}
          <Arrow kind="fast" reveal={showTactile} d="M 330 380 L 352 416" />
          <Arrow kind="fast" reveal={showTactile} d="M 330 424 L 352 432" />
          <Arrow kind="fast" reveal={showTactile} d="M 330 468 L 352 452" />
          {/* z_t -> tactile expert */}
          <Arrow kind="fast" reveal={showTactile} d="M 398 434 L 446 426" />
          {/* action -> x_hat -> tactile */}
          <Arrow kind="ink" reveal={showXhat} d="M 534 238 L 534 286" />
          <Arrow kind="fast" reveal={showTactile} d="M 520 318 C 480 360, 470 388, 470 406" />
          {/* latent/action -> KV cache (detached) */}
          <Arrow kind="slow" reveal={showCache} dashed d="M 686 200 C 730 210, 740 220, 760 244" />
          {/* KV cache -> tactile (cloned) */}
          <Arrow kind="fast" reveal={showTactile} dashed d="M 800 300 C 760 360, 700 410, 690 422" />
          {/* tactile -> action chunk out */}
          <Arrow kind="fast" reveal={showOut} d="M 686 424 L 740 424" />
          {/* action chunk -> controller */}
          <Arrow kind="ink" reveal={showCtrl} d="M 876 424 L 904 424" />

          {/* ---- INPUTS ---- */}
          <Box x={24} y={70} w={150} h={44} variant="slow" reveal={showInputs} tag="RGB" title="3 cameras" sub="head + 2 wrist" />
          <Box x={24} y={122} w={150} h={38} variant="slow" reveal={showInputs} title="Language" sub="instruction" />
          <Box x={24} y={358} w={150} h={42} variant="fast" reveal={showInputs} tag="Touch" title="Force history" sub="6-D × 16 frames" />
          <Box x={24} y={406} w={150} h={34} variant="fast" reveal={showInputs} title="Instant force f" sub="low latency" />
          <Box x={24} y={446} w={150} h={44} variant="fast" reveal={showInputs} title="Deformation map" sub="per fingertip" />

          {/* ---- ENCODERS ---- */}
          <Box x={200} y={70} w={130} h={90} variant="slow" reveal={showSlowEnc} title="VLM tower" sub="Qwen3VL-2B" />
          <Box x={200} y={356} w={130} h={46} variant="fast" reveal={showTactile} title="Temporal" sub="VQ-VAE (K=64)" />
          <Box x={200} y={406} w={130} h={32} variant="fast" reveal={showTactile} title="Proj f" />
          <Box x={200} y={444} w={130} h={48} variant="fast" reveal={showTactile} frozen title="Deform enc" sub="ResNet · frozen" />
          <Box x={352} y={404} w={46} h={60} variant="fast" reveal={showTactile} title="z" />

          {/* ---- MoT container ---- */}
          <g style={{ opacity: showSlowEnc ? 1 : 0.12 }}>
            <rect className="arch-box arch-box--mot" x={360} y={60} width={344} height={440} rx={16} />
            <text className="arch-tag" x={372} y={80} style={{ fill: "var(--trex-muted)" }}>Mixture-of-Transformer · shared self-attention</text>
          </g>
          <Box x={384} y={88} w={300} h={66} variant="slow" reveal={showSlowEnc} dim={slowDim} tag="Latent expert" title="predict future visual repr." sub="Qwen3VL-2B · 1.41B" />
          <Box x={384} y={170} w={300} h={68} variant="slow" reveal={showSlowEnc} dim={slowDim} tag="Action expert" title="coarse plan · τ 1 → 0.4" sub="6 flow steps · 1.41B" />
          <Box x={446} y={392} w={238} h={64} variant="fast" reveal={showTactile} tag="Tactile expert" title="refine · τ 0.4 → 0" sub="4 flow steps · 0.62B" />

          {/* x_hat node */}
          <Box x={478} y={286} w={112} h={32} variant="slow" reveal={showXhat} dim={slowDim} title="x̂ @ τ=0.4" />

          {/* KV cache (frozen) */}
          <g className="arch-node" style={{ opacity: showCache ? 1 : 0.12 }}>
            <rect className="arch-box" x={740} y={244} width={140} height={62} rx={10} style={{ fill: "rgba(26,23,20,0.05)", strokeDasharray: "4 4" }} />
            <text className="arch-label" x={810} y={270} textAnchor="middle">❄ KV @ 0.4</text>
            <text className="arch-sub" x={810} y={288} textAnchor="middle">frozen context</text>
          </g>

          {/* output */}
          <Box x={740} y={392} w={136} h={64} variant="fast" reveal={showOut} tag="Output" title="Action chunk" sub="62-dim × 16" />
          <Box x={904} y={392} w={112} h={64} variant="mot" reveal={showCtrl} title="300 Hz" sub="controller" />

          {/* ---- flow timeline ---- */}
          <g>
            <rect className="arch-timeline-track" x={FX_L} y={FY - 5} width={FX_R - FX_L} height={10} rx={5} />
            <rect className="arch-timeline-slow" x={FX_L} y={FY - 5} width={splitX - FX_L} height={10} rx={5} style={{ opacity: 0.55 }} />
            <rect className="arch-timeline-fast" x={splitX} y={FY - 5} width={FX_R - splitX} height={10} rx={5} style={{ opacity: 0.55 }} />
            <line x1={splitX} y1={FY - 12} x2={splitX} y2={FY + 12} stroke="var(--trex-line-strong)" strokeWidth={1.5} />
            <text className="arch-sub" x={FX_L} y={FY + 26} textAnchor="start">τ = 1 (noise)</text>
            <text className="arch-sub" x={splitX} y={FY + 26} textAnchor="middle">τ = 0.4 (split)</text>
            <text className="arch-sub" x={FX_R} y={FY + 26} textAnchor="end">τ = 0 (action)</text>
            <circle className="arch-marker" cx={markerX} cy={FY} r={9} style={{ transition: "cx 1.4s cubic-bezier(0.5,0,0.2,1)" }} />
          </g>

          {/* ---- clocks ---- */}
          <g transform="translate(958 130)">
            <circle r={26} fill="none" stroke="var(--trex-slow)" strokeWidth={2} />
            <line x1={0} y1={0} x2={0} y2={-18} stroke="var(--trex-slow)" strokeWidth={2.5} style={{ transformOrigin: "0 0", animation: playing ? "trex-clock-slow 4s linear infinite" : "none" }} />
            <text className="arch-tag arch-tag--slow" x={0} y={44} textAnchor="middle">slow</text>
          </g>
          <g transform="translate(958 430)">
            <circle r={26} fill="none" stroke="var(--trex-fast)" strokeWidth={2} />
            <line x1={0} y1={0} x2={0} y2={-18} stroke="var(--trex-fast)" strokeWidth={2.5} style={{ transformOrigin: "0 0", animation: playing ? "trex-clock-fast 1s linear infinite" : "none" }} />
            <text className="arch-tag arch-tag--fast" x={0} y={44} textAnchor="middle">fast ×4</text>
          </g>
        </svg>
      </div>

      <div className="arch-beat">
        <b>{beat + 1}. {BEATS[beat].title}.</b> {BEATS[beat].body}
      </div>

      <div className="arch-legend">
        <span><i style={{ background: "var(--trex-slow)" }} /> slow visuomotor path</span>
        <span><i style={{ background: "var(--trex-fast)" }} /> fast tactile path</span>
        <span><i style={{ background: "var(--trex-line-strong)" }} /> frozen / cached</span>
      </div>

      <figcaption>
        Figure {figureNumber}: The T-Rex model — a variable-rate Mixture-of-Transformer with a latent expert, a slow
        action expert, and a fast, lightweight tactile expert that performs high-frequency residual refinement via an
        asynchronous cascaded flow-matching scheme.
      </figcaption>
    </figure>
  );
}
