"use client";

import { Maximize2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ExpandableVideoViewer from "@/components/ExpandableVideoViewer";
import { DATASET_FALLBACK, hf, type DatasetClip } from "@/data/trex";

const POOL_SIZE = 500;
const DISPLAY_SIZE = 30;
const TOP_N = 10;
const OTHER = "__OTHER__";

type Row = { file_name: string; object: string; verb: string };

function pretty(s: string) {
  if (!s) return s;
  return s
    .split("_")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

// CSV parser (handles quoted fields + embedded commas), ported from the
// original visualizer.
function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let i = 0,
    field = "",
    row: string[] = [],
    inQuote = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuote = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuote = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (field.length > 0 || row.length > 0) {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      }
      if (c === "\r" && text[i + 1] === "\n") i++;
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length === 0) return [];
  const headers = rows[0];
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => (obj[h] = r[idx] ?? ""));
    return obj;
  });
}

function sample<T>(arr: T[], n: number): T[] {
  const a = arr.slice();
  const out: T[] = [];
  const k = Math.min(n, a.length);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(Math.random() * (a.length - i));
    [a[i], a[j]] = [a[j], a[i]];
    out.push(a[i]);
  }
  return out;
}

function countBy(rows: Row[], key: keyof Row) {
  const counts: Record<string, number> = {};
  for (const r of rows) {
    const v = r[key];
    if (!v) continue;
    counts[v] = (counts[v] || 0) + 1;
  }
  return counts;
}
function topNNames(counts: Record<string, number>, n: number) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map((e) => e[0]);
}

// Lazy card: only sets the video src when scrolled into view (keeps dozens of
// clips from all streaming at once).
function CardVideo({ clip, onExpand }: { clip: Row; onExpand: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const src = clip.file_name.startsWith("http") ? clip.file_name : hf.datasetClip(clip.file_name);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setVisible(e.isIntersecting)),
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="ds-card" ref={ref} onClick={onExpand} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onExpand(); }}>
      {visible ? (
        <video autoPlay loop muted playsInline preload="none" src={src} />
      ) : (
        <video muted playsInline preload="none" />
      )}
      <div className="ds-card__meta">
        <span className="ds-card__verb">{pretty(clip.verb)}</span>
        <span className="ds-card__obj">{pretty(clip.object)}</span>
      </div>
    </div>
  );
}

export default function DatasetGallery() {
  const [rows, setRows] = useState<Row[]>([]);
  const [pool, setPool] = useState<Row[]>([]);
  const [topObjects, setTopObjects] = useState<string[]>([]);
  const [topVerbs, setTopVerbs] = useState<string[]>([]);
  const [selObjects, setSelObjects] = useState<Set<string>>(new Set());
  const [selVerbs, setSelVerbs] = useState<Set<string>>(new Set());
  const [displayed, setDisplayed] = useState<Row[]>([]);
  const [status, setStatus] = useState("Loading dataset…");
  const [viewer, setViewer] = useState<{ src: string; title: string } | null>(null);

  const resample = useCallback((all: Row[]) => {
    const p = sample(all, POOL_SIZE);
    setPool(p);
    setTopObjects(topNNames(countBy(p, "object"), TOP_N));
    setTopVerbs(topNNames(countBy(p, "verb"), TOP_N));
    setSelObjects(new Set());
    setSelVerbs(new Set());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(hf.datasetCsv);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const parsed = parseCSV(await resp.text()) as unknown as Row[];
        const clean = parsed.filter((r) => r.file_name && r.object && r.verb);
        if (clean.length === 0) throw new Error("empty");
        if (cancelled) return;
        setRows(clean);
        resample(clean);
      } catch {
        if (cancelled) return;
        // Fallback to the curated clip set so the gallery always shows content.
        const fb: Row[] = DATASET_FALLBACK.map((c: DatasetClip) => ({
          file_name: c.file,
          object: c.object.replace(/ /g, "_"),
          verb: c.verb,
        }));
        setRows(fb);
        resample(fb);
        setStatus("Showing curated sample clips (live metadata unavailable).");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resample]);

  const matches = useMemo(() => {
    const match = (r: Row) => {
      if (selObjects.size > 0) {
        const isOther = !topObjects.includes(r.object);
        if (!(selObjects.has(r.object) || (isOther && selObjects.has(OTHER)))) return false;
      }
      if (selVerbs.size > 0) {
        const isOther = !topVerbs.includes(r.verb);
        if (!(selVerbs.has(r.verb) || (isOther && selVerbs.has(OTHER)))) return false;
      }
      return true;
    };
    return pool.filter(match);
  }, [pool, selObjects, selVerbs, topObjects, topVerbs]);

  useEffect(() => {
    setDisplayed(sample(matches, DISPLAY_SIZE));
    if (rows.length) {
      setStatus(
        `Showing ${Math.min(matches.length, DISPLAY_SIZE)} of ${matches.length} matching clips` +
          (rows.length > pool.length ? ` · ${rows.length.toLocaleString()} total in dataset` : ""),
      );
    }
  }, [matches, rows.length, pool.length]);

  // Cross-filtered counts: object counts respect the verb selection and vice versa.
  const objCounts = useMemo(
    () => countBy(pool.filter((r) => selVerbs.size === 0 || selVerbs.has(r.verb) || (selVerbs.has(OTHER) && !topVerbs.includes(r.verb))), "object"),
    [pool, selVerbs, topVerbs],
  );
  const verbCounts = useMemo(
    () => countBy(pool.filter((r) => selObjects.size === 0 || selObjects.has(r.object) || (selObjects.has(OTHER) && !topObjects.includes(r.object))), "verb"),
    [pool, selObjects, topObjects],
  );

  const toggle = (set: Set<string>, key: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  };

  const otherObj = Object.entries(objCounts).filter(([k]) => !topObjects.includes(k)).reduce((s, [, v]) => s + v, 0);
  const otherVerb = Object.entries(verbCounts).filter(([k]) => !topVerbs.includes(k)).reduce((s, [, v]) => s + v, 0);

  return (
    <div className="ds-gallery">
      <div className="ds-filters">
        <div className="ds-filter-row">
          <span className="ds-filter-label">Object</span>
          <button className="ds-chip" data-active={selObjects.size === 0} onClick={() => setSelObjects(new Set())} type="button">
            All
          </button>
          {topObjects.map((o) => (
            <button key={o} className="ds-chip" data-active={selObjects.has(o)} onClick={() => toggle(selObjects, o, setSelObjects)} type="button">
              {pretty(o)} <span style={{ opacity: 0.6 }}>({objCounts[o] || 0})</span>
            </button>
          ))}
          {otherObj > 0 && (
            <button className="ds-chip" data-active={selObjects.has(OTHER)} onClick={() => toggle(selObjects, OTHER, setSelObjects)} type="button">
              Other <span style={{ opacity: 0.6 }}>({otherObj})</span>
            </button>
          )}
        </div>
        <div className="ds-filter-row">
          <span className="ds-filter-label">Motion</span>
          <button className="ds-chip" data-kind="verb" data-active={selVerbs.size === 0} onClick={() => setSelVerbs(new Set())} type="button">
            All
          </button>
          {topVerbs.map((v) => (
            <button key={v} className="ds-chip" data-kind="verb" data-active={selVerbs.has(v)} onClick={() => toggle(selVerbs, v, setSelVerbs)} type="button">
              {pretty(v)} <span style={{ opacity: 0.6 }}>({verbCounts[v] || 0})</span>
            </button>
          ))}
          {otherVerb > 0 && (
            <button className="ds-chip" data-kind="verb" data-active={selVerbs.has(OTHER)} onClick={() => toggle(selVerbs, OTHER, setSelVerbs)} type="button">
              Other <span style={{ opacity: 0.6 }}>({otherVerb})</span>
            </button>
          )}
        </div>
        <div className="ds-filter-row">
          <button className="trex-btn" onClick={() => resample(rows)} type="button" disabled={!rows.length}>
            <RefreshCw size={13} /> Resample
          </button>
          <span className="ds-count">{status}</span>
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="ds-empty">No clips match the selected filters.</div>
      ) : (
        <div className="ds-grid">
          {displayed.map((clip) => (
            <CardVideo
              key={clip.file_name}
              clip={clip}
              onExpand={() =>
                setViewer({
                  src: clip.file_name.startsWith("http") ? clip.file_name : hf.datasetClip(clip.file_name),
                  title: `${pretty(clip.verb)} / ${pretty(clip.object)}`,
                })
              }
            />
          ))}
        </div>
      )}

      <ExpandableVideoViewer
        isOpen={Boolean(viewer)}
        loop
        onClose={() => setViewer(null)}
        src={viewer?.src ?? ""}
        title={viewer?.title ?? ""}
      />
    </div>
  );
}
