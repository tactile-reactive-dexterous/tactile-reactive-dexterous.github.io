"use client";

import { useEffect, useRef, useState } from "react";

// Hero with a continuously-playing teaser video (autoplay + loop, never gated by
// scroll). The overlaid title was removed per request — the video plays clean,
// and the real paper title lives in the article header below.
//
// A black curtain covers the whole page until the browser reports it can play
// the teaser through without stalling, so nobody sees a half-buffered first
// frame. The video autoplays behind the curtain (that is what makes browsers
// buffer aggressively) and is rewound to frame 0 the moment the curtain lifts.
// Three safety nets keep the page from ever being stuck behind a black screen:
// a playback error lifts it, a hard timeout lifts it, and <noscript> hides it.
export default function TrexHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let lifted = false;
    const reveal = () => {
      if (lifted) return;
      lifted = true;
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        void video.play().catch(() => {});
      }
      setRevealed(true);
    };

    // Hard safety net, registered first so it holds even if the ref is missing.
    const fallback = window.setTimeout(reveal, 15000);

    const video = videoRef.current;
    if (!video) {
      return () => window.clearTimeout(fallback);
    }

    video.addEventListener("canplaythrough", reveal);
    video.addEventListener("error", reveal);

    // HAVE_ENOUGH_DATA — a cached video can already be ready before we listen.
    // Deferred a tick so the reveal never fires inside the effect body.
    const cached = video.readyState >= 4 ? window.setTimeout(reveal, 0) : undefined;

    return () => {
      video.removeEventListener("canplaythrough", reveal);
      video.removeEventListener("error", reveal);
      window.clearTimeout(fallback);
      if (cached !== undefined) window.clearTimeout(cached);
    };
  }, []);

  // Freeze the page underneath so a stray scroll can't move content the visitor
  // cannot see yet.
  useEffect(() => {
    if (revealed) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [revealed]);

  // The teaser has no audio track, and Chrome pauses video-only media in
  // background tabs to save power. Without this it can come back frozen on a
  // still frame after the visitor tabs away and returns.
  useEffect(() => {
    const resume = () => {
      const video = videoRef.current;
      if (!video || document.hidden || !video.paused) return;
      void video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, []);

  return (
    <>
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: ".hero-curtain{display:none}" }} />
      </noscript>
      <div aria-hidden="true" className={`hero-curtain${revealed ? " hero-curtain--lifted" : ""}`} />
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
            src="/figures/hero_short.mp4"
          />
          <a className="scroll-cue" href="#article-content">
            Scroll to explore
          </a>
        </div>
      </section>
    </>
  );
}
