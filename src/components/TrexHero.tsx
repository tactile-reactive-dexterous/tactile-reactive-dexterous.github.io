"use client";

import { useEffect, useRef, useState } from "react";
import { hf } from "@/data/trex";

const WORDMARK = "T-Rex".split("");

// Hero with a continuously-playing teaser video (autoplay + loop, never gated by
// scroll) and a wordmark that reveals on mount. This is the enpire hero pattern
// adapted for T-Rex: the video keeps looping the whole time the hero is on screen.
export default function TrexHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Reveal the wordmark shortly after mount (the video starts playing
    // immediately and never stops, regardless of scroll position).
    const id = window.setTimeout(() => setRevealed(true), 450);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="article-hero">
      <div className="article-hero__sticky">
        <video
          aria-label="T-Rex tactile-reactive manipulation overview"
          autoPlay
          className="article-hero__video"
          loop
          muted
          playsInline
          preload="auto"
          ref={videoRef}
          src={hf.overview}
        />
        <div className="article-hero__title" data-revealed={revealed}>
          <span className="article-hero__wordmark" aria-label="T-Rex">
            {WORDMARK.map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="article-hero__letter"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {ch}
              </span>
            ))}
          </span>
          <span className="hero-tagline">
            Tactile-Reactive Dexterous Manipulation — <em>feel, react, manipulate at the speed of contact</em>
          </span>
        </div>
        <a className="scroll-cue" href="#article-content">
          Scroll to explore
        </a>
      </div>
    </section>
  );
}
