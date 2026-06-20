"use client";

import { hf } from "@/data/trex";

// Hero with a continuously-playing teaser video (autoplay + loop, never gated by
// scroll). The overlaid title was removed per request — the video plays clean,
// and the real paper title lives in the article header below.
export default function TrexHero() {
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
          src={hf.overview}
        />
        <a className="scroll-cue" href="#article-content">
          Scroll to explore
        </a>
      </div>
    </section>
  );
}
