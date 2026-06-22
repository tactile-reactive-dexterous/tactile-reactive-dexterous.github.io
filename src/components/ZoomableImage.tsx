"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
};

// A figure image that opens a full-screen lightbox when clicked (click anywhere
// outside / press Esc to close). Used for every static figure on the page.
export default function ZoomableImage({ src, alt, width, height, className, style }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Image
        alt={alt}
        className={className}
        height={height}
        onClick={() => setOpen(true)}
        src={src}
        style={{ cursor: "zoom-in", ...style }}
        unoptimized
        width={width}
      />
      {open && mounted
        ? createPortal(
            <div className="img-lightbox" onClick={() => setOpen(false)} role="presentation">
              <button className="img-lightbox__close" aria-label="Close" onClick={() => setOpen(false)} type="button">
                <X aria-hidden="true" size={22} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={alt} className="img-lightbox__img" onClick={(e) => e.stopPropagation()} src={src} />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
