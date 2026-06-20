"use client";

import { useMemo } from "react";

// Decorative animated "tactile signal" curves used as a section background
// (requirement: curves should live in the background and use more animation).
// Pure CSS/SVG — several smooth sine-like force traces continuously flow via an
// animated stroke-dashoffset, evoking the high-frequency tactile streams T-Rex
// reacts to. Honest decoration: no axes, no claimed numbers.
function wavePath(width: number, height: number, amp: number, freq: number, phase: number) {
  const mid = height / 2;
  const steps = 64;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y =
      mid +
      Math.sin((i / steps) * Math.PI * 2 * freq + phase) * amp +
      Math.sin((i / steps) * Math.PI * 2 * freq * 2.3 + phase * 1.7) * amp * 0.32;
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

export default function TactileWaveBackground({
  variant = "warm",
}: {
  variant?: "warm" | "cool" | "mixed";
}) {
  const W = 1200;
  const H = 360;
  const lines = useMemo(() => {
    const palette =
      variant === "warm"
        ? ["var(--trex-fast)", "var(--trex-gold-bright)", "var(--trex-fast)"]
        : variant === "cool"
        ? ["var(--trex-slow)", "var(--trex-gold-bright)", "var(--trex-slow)"]
        : ["var(--trex-slow)", "var(--trex-gold-bright)", "var(--trex-fast)"];
    return [
      { amp: 46, freq: 3, phase: 0, color: palette[0], width: 2, dur: 14, off: 0.18 },
      { amp: 30, freq: 5, phase: 1.1, color: palette[1], width: 1.5, dur: 9, off: 0.13 },
      { amp: 62, freq: 2, phase: 2.4, color: palette[2], width: 2.5, dur: 19, off: 0.1 },
      { amp: 22, freq: 7, phase: 0.6, color: palette[1], width: 1.2, dur: 7, off: 0.1 },
    ];
  }, [variant]);

  return (
    <div className="tactile-bg" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {lines.map((l, i) => (
          <path
            key={i}
            d={wavePath(W, H, l.amp, l.freq, l.phase)}
            stroke={l.color}
            strokeWidth={l.width}
            style={{
              opacity: l.off,
              strokeDasharray: "14 10",
              animation: `trex-dash-flow ${l.dur}s linear infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
