"use client";

import { Maximize2, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ExpandableVideoViewer from "@/components/ExpandableVideoViewer";
import { DEMO_TASKS, hf } from "@/data/trex";

// The 10 tasks that have the original on-page demo clip (task_demos_speed) — the
// same single video the previous T-Rex site showed. We play it at normal speed
// (the file is already sped up; no extra acceleration), with task pills only —
// no category tabs and no second camera view.
const TASKS = DEMO_TASKS.filter((t) => t.mainFile);

export default function DemoGallery() {
  const [activeId, setActiveId] = useState(TASKS[0].id);
  const task = useMemo(() => TASKS.find((t) => t.id === activeId) ?? TASKS[0], [activeId]);
  const [playing, setPlaying] = useState(true);
  const [viewer, setViewer] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const src = hf.speed(task.mainFile as string);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => undefined);
    else v.pause();
  }, [playing, task]);

  return (
    <div className="demo-gallery">
      <div className="demo-gallery__pills" role="tablist">
        {TASKS.map((t) => (
          <button
            key={t.id}
            className="demo-pill"
            data-active={t.id === activeId}
            onClick={() => setActiveId(t.id)}
            role="tab"
            aria-selected={t.id === activeId}
            type="button"
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="demo-views" data-single="true">
        <div className="demo-view">
          <video key={src} autoPlay loop muted playsInline preload="metadata" ref={videoRef} src={src} />
          <button
            aria-label={`Expand ${task.name}`}
            className="demo-view__expand"
            onClick={() => setViewer(true)}
            type="button"
          >
            <Maximize2 aria-hidden="true" size={15} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="demo-controls">
        <button className="trex-btn" onClick={() => setPlaying((p) => !p)} type="button">
          {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "Pause" : "Play"}
        </button>
      </div>

      <p className="demo-desc">
        <b>{task.name}.</b> &ldquo;{task.instruction}&rdquo;
      </p>

      <ExpandableVideoViewer isOpen={viewer} loop onClose={() => setViewer(false)} src={src} title={task.name} />
    </div>
  );
}
