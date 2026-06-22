"use client";

import { useEffect, useRef } from "react";

// A muted, looping video that starts playing only once it scrolls into view
// (and pauses when it leaves), mirroring the teaser's scroll-triggered play.
export default function ScrollPlayVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video ref={ref} className={className} src={src} loop muted playsInline preload="metadata" />
  );
}
