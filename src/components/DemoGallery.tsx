"use client";

import { Maximize2, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ExpandableVideoViewer from "@/components/ExpandableVideoViewer";
import { CATEGORY_LABEL, DEMO_TASKS, hf, type DemoTask, type TaskCategory } from "@/data/trex";

const SPEEDS = [1, 2, 4, 8] as const;
const CATS: ("all" | TaskCategory)[] = ["all", "force", "deform", "bimanual"];
const CAT_LABEL: Record<string, string> = { all: "All tasks", ...CATEGORY_LABEL };

function mainSrc(task: DemoTask) {
  return task.mainFile ? hf.speed(task.mainFile) : hf.head(task.id);
}

// The second camera pane. Tries the (to-be-uploaded) third-person clip first,
// then gracefully falls back to the head-camera loop that already exists on HF,
// then to a labelled placeholder — so the multi-view UI always shows something
// real and auto-upgrades to true third-person once those files are uploaded.
function SecondView({
  task,
  speed,
  playing,
  onExpand,
}: {
  task: DemoTask;
  speed: number;
  playing: boolean;
  onExpand: (src: string, label: string) => void;
}) {
  const chain = useMemo(() => {
    const c: { src: string; label: string }[] = [];
    if (task.thirdFile) c.push({ src: hf.thirdView(task.thirdFile), label: "Third-person" });
    c.push({ src: hf.head(task.id), label: "Head camera" });
    return c;
  }, [task]);

  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => setIdx(0), [task]);
  useEffect(() => {
    if (ref.current) ref.current.playbackRate = speed;
  }, [speed, idx]);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => undefined);
    else v.pause();
  }, [playing, idx]);

  const current = chain[idx];
  if (!current) {
    return (
      <div className="demo-view">
        <div className="demo-view__missing">Third-person view — add this clip to enable.</div>
      </div>
    );
  }

  return (
    <div className="demo-view">
      <video
        key={current.src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        ref={ref}
        src={current.src}
        onLoadedMetadata={(e) => {
          e.currentTarget.playbackRate = speed;
        }}
        onError={() => setIdx((i) => i + 1)}
      />
      <span className="demo-view__tag">{current.label}</span>
      <button
        aria-label={`Expand ${task.name} ${current.label} view`}
        className="demo-view__expand"
        onClick={() => onExpand(current.src, `${task.name} · ${current.label}`)}
        type="button"
      >
        <Maximize2 aria-hidden="true" size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
}

export default function DemoGallery() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const tasks = useMemo(() => (cat === "all" ? DEMO_TASKS : DEMO_TASKS.filter((t) => t.category === cat)), [cat]);
  const [activeId, setActiveId] = useState(DEMO_TASKS[0].id);
  const task = useMemo(() => DEMO_TASKS.find((t) => t.id === activeId) ?? DEMO_TASKS[0], [activeId]);

  const [speedIdx, setSpeedIdx] = useState(1);
  const [playing, setPlaying] = useState(true);
  const speed = SPEEDS[speedIdx];
  const mainRef = useRef<HTMLVideoElement | null>(null);
  const [viewer, setViewer] = useState<{ src: string; title: string } | null>(null);

  // Keep the active task inside the current category.
  useEffect(() => {
    if (!tasks.some((t) => t.id === activeId)) setActiveId(tasks[0].id);
  }, [tasks, activeId]);

  useEffect(() => {
    if (mainRef.current) mainRef.current.playbackRate = speed;
  }, [speed, task]);
  useEffect(() => {
    const v = mainRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => undefined);
    else v.pause();
  }, [playing, task]);

  const hasThird = Boolean(task.thirdFile);
  const mainLabel = task.mainFile ? "Main · 5×" : "Head camera";
  const main = mainSrc(task);

  return (
    <div className="demo-gallery">
      <div className="demo-gallery__cats">
        {CATS.map((c) => (
          <button key={c} className="demo-cat" data-active={cat === c} onClick={() => setCat(c)} type="button">
            {CAT_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="demo-gallery__pills" role="tablist">
        {tasks.map((t) => (
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

      <div className="demo-views" data-single={!hasThird}>
        <div className="demo-view">
          <video
            key={main}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            ref={mainRef}
            src={main}
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = speed;
            }}
          />
          <span className="demo-view__tag">{mainLabel}</span>
          <button
            aria-label={`Expand ${task.name} main view`}
            className="demo-view__expand"
            onClick={() => setViewer({ src: main, title: `${task.name} · ${mainLabel}` })}
            type="button"
          >
            <Maximize2 aria-hidden="true" size={15} strokeWidth={1.8} />
          </button>
        </div>

        {hasThird ? (
          <SecondView
            task={task}
            speed={speed}
            playing={playing}
            onExpand={(src, title) => setViewer({ src, title })}
          />
        ) : null}
      </div>

      <div className="demo-controls">
        <button className="trex-btn" onClick={() => setPlaying((p) => !p)} type="button">
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "Pause" : "Play"}
        </button>
        <button
          className="trex-btn"
          onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
          type="button"
          aria-label={`Playback speed ${speed}x, click to change`}
        >
          {speed}× speed
        </button>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--trex-muted)" }}>
          {CATEGORY_LABEL[task.category]}
        </span>
      </div>

      <p className="demo-desc">
        <b>{task.name}.</b> &ldquo;{task.instruction}&rdquo;
      </p>

      <ExpandableVideoViewer
        isOpen={Boolean(viewer)}
        loop
        onClose={() => setViewer(null)}
        playbackRate={speed}
        speedLabel={`${speed}×`}
        src={viewer?.src ?? ""}
        title={viewer?.title ?? ""}
      />
    </div>
  );
}
