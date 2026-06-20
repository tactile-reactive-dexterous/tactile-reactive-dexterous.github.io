# T-Rex Website

Project website for **T-Rex: Tactile-Reactive Dexterous Manipulation**.

Built on the [ENPIRE](https://github.com/enpire-research/enpire-research.github.io) project-page
template (Next.js + React + TypeScript + Tailwind), restyled and rebuilt with T-Rex content and a
set of T-Rex-specific interactive flagships:

- a continuously-playing hero teaser video,
- a long-form article that walks through the whole paper, with a sticky table of contents,
- an interactive **dataset gallery** (filter by object / motion primitive, resample),
- an interactive **multi-view demonstration gallery** (main + second camera view per task),
- an **animated Mixture-of-Transformer architecture** diagram (play / scrub the control loop),
- **animated results** (bar chart + per-task table + ablations) on a clean background,
- an **animated data-efficiency curve** and decorative tactile-wave backgrounds.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
```

## Checks

```bash
npm run typecheck
npm run build    # static export to ./out  (output: "export" in next.config.ts)
```

## Structure

- `src/app` — Next.js route, layout, `globals.css` (template base) + `trex.css` (T-Rex styles).
- `src/components` — `TrexHero`, `DemoGallery`, `DatasetGallery`, `ArchitectureFigure`,
  `ResultsChart`, `DataEfficiencyCurve`, `TactileWaveBackground`, plus the shared `VideoPlayer` /
  `ExpandableVideoViewer`.
- `src/data/trex.ts` — tasks, results numbers, dataset config, and all Hugging Face video URLs.
- `public` — fonts, favicon, institution logos.

## Videos

All videos stream from the existing Hugging Face dataset `Beakerman0101/trex-visualizer`, so the
repo stays small and GitHub-Pages friendly. To light up the **second camera view** in the
demonstration gallery, upload the third-person clips from `T-Rex/task_demo_third_view/` to
`task_demos_third_view/` in that dataset (see `src/data/trex.ts` → `hf.thirdView`). Until then the
gallery automatically falls back to the head-camera loop.

## Deploy

See [DEPLOY.md](DEPLOY.md) for the full step-by-step (new GitHub org → new repo → free GitHub Pages
via the included `.github/workflows/deploy-pages.yml`).
