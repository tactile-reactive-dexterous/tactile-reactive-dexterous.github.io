"use client";

import { Code, FileText, List, X } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import TrexHero from "@/components/TrexHero";
import DemoGallery from "@/components/DemoGallery";
import ZoomableImage from "@/components/ZoomableImage";
import { AblationBars, ResultsBars, ResultsTable } from "@/components/ResultsChart";
import { FAILURE_CASES } from "@/data/trex";

const outlineItems: { href: string; label: string; level?: number }[] = [
  { href: "#article-title", label: "Title" },
  { href: "#abstract", label: "Abstract" },
  { href: "#contributions", label: "Contributions" },
  { href: "#dataset", label: "The T-Rex Dataset" },
  { href: "#dataset-gallery", label: "Explore the dataset", level: 2 },
  { href: "#architecture", label: "Model & Architecture" },
  { href: "#tactile-encoder", label: "Temporal tactile VQ-VAE", level: 2 },
  { href: "#training", label: "Training recipe", level: 2 },
  { href: "#demos", label: "Demonstrations" },
  { href: "#results", label: "Results" },
  { href: "#per-task", label: "Per-task results", level: 2 },
  { href: "#ablations", label: "Ablations", level: 2 },
  { href: "#failures", label: "Failure cases" },
  { href: "#limitations", label: "Limitations" },
  { href: "#conclusion", label: "Conclusion" },
  { href: "#citation", label: "Citation" },
];

const authors = [
  { name: "Dantong Niu", marks: "1,2,*" },
  { name: "Zhuoyang Liu", marks: "1,*" },
  { name: "Zekai Wang", marks: "1,*" },
  { name: "Boning Shao", marks: "1" },
  { name: "Zhao-Heng Yin", marks: "1" },
  { name: "Anirudh Pai", marks: "1" },
  { name: "Yuvan Sharma", marks: "1" },
  { name: "Stefano Saravalle", marks: "5" },
  { name: "Ruijie Zheng", marks: "2" },
  { name: "Jing Wang", marks: "2" },
  { name: "Ryan Punamiya", marks: "2" },
  { name: "Mengda Xu", marks: "2" },
  { name: "Yuqi Xie", marks: "2" },
  { name: "Yunfan Jiang", marks: "2,3" },
  { name: "Letian Fu", marks: "1" },
  { name: "Konstantinos Kallidromitis", marks: "4" },
  { name: "Matteo Gioia", marks: "5,6" },
  { name: "Junyi Zhang", marks: "1" },
  { name: "Jiaxin Ge", marks: "1" },
  { name: "Haiwen Feng", marks: "1" },
  { name: "Fabio Galasso", marks: "5,6" },
  { name: "Wei Zhan", marks: "1" },
  { name: "David M. Chan", marks: "1" },
  { name: "Yutong Bai", marks: "1" },
  { name: "Roei Herzig", marks: "1" },
  { name: "Jiahui Lei", marks: "1" },
  { name: "Fei-Fei Li", marks: "3" },
  { name: "Ken Goldberg", marks: "1" },
  { name: "Jitendra Malik", marks: "1" },
  { name: "Pieter Abbeel", marks: "1" },
  { name: "Yuke Zhu", marks: "2" },
  { name: "Danfei Xu", marks: "2" },
  { name: "Jim (Linxi) Fan", marks: "2" },
  { name: "Trevor Darrell", marks: "1" },
];

const affiliations = [
  { mark: "1", label: "UC Berkeley" },
  { mark: "2", label: "NVIDIA" },
  { mark: "3", label: "Stanford" },
  { mark: "4", label: "Panasonic" },
  { mark: "5", label: "La Sapienza University" },
  { mark: "6", label: "ItalAI" },
  { mark: "*", label: "Equal contribution" },
];

const logos = [
  { alt: "UC Berkeley", src: "/images/logos/uc-berkeley-logo.png", w: 1064, h: 214 },
  { alt: "NVIDIA", src: "/images/logos/nvidia-logo.png", w: 2756, h: 540 },
];

function Outline({ activeHref }: { activeHref: string }) {
  return (
    <aside className="article-outline" aria-label="Article outline">
      <nav>
        {outlineItems.map((item) => (
          <a key={item.href} href={item.href} data-level={item.level ?? 1} aria-current={activeHref === item.href ? "true" : undefined}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function MobileOutline({ activeHref }: { activeHref: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className="mobile-outline">
      <button aria-expanded={open} aria-label="Open table of contents" className="mobile-outline__trigger" onClick={() => setOpen(true)} type="button">
        <List aria-hidden="true" size={16} strokeWidth={1.9} /> Contents
      </button>
      <div className="mobile-outline__overlay" data-open={open} role="presentation" onClick={() => setOpen(false)}>
        <nav aria-label="Table of contents" className="mobile-outline__panel" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-outline__head">
            <span>Contents</span>
            <button aria-label="Close table of contents" onClick={() => setOpen(false)} type="button"><X size={18} strokeWidth={1.8} /></button>
          </div>
          <div className="mobile-outline__links">
            {outlineItems.map((item) => (
              <a key={item.href} href={item.href} data-level={item.level ?? 1} aria-current={activeHref === item.href ? "true" : undefined} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

function ArticleContent() {
  const [activeHref, setActiveHref] = useState(outlineItems[0].href);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const targetY = window.innerHeight * 0.28;
      let current = outlineItems[0].href;
      for (const item of outlineItems) {
        const section = document.getElementById(item.href.slice(1));
        if (!section) continue;
        if (section.getBoundingClientRect().top <= targetY) current = item.href;
      }
      setActiveHref((prev) => (prev === current ? prev : current));
    };
    const request = () => { if (!frame) frame = window.requestAnimationFrame(sync); };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  return (
    <section className="article-body" data-outline-open="true" id="article-content">
      <div className="article-layout">
        <Outline activeHref={activeHref} />
        <MobileOutline activeHref={activeHref} />
        <article className="article-shell">
          <header className="article-title-block" id="article-title">
            <h1>
              <span>T-Rex: Tactile-Reactive</span>
              <span>Dexterous Manipulation</span>
            </h1>
            <div className="article-authors" aria-label="Authors and affiliations">
              <p className="article-authors__names">
                {authors.map((a, i) => (
                  <Fragment key={a.name}>
                    <span className="article-author">
                      {a.name}
                      <sup>{a.marks}</sup>
                    </span>
                    {i < authors.length - 1 ? ", " : ""}
                  </Fragment>
                ))}
              </p>
              <p className="article-authors__affiliations">
                {affiliations.map((af) => (
                  <span key={af.mark}><sup>{af.mark}</sup>{af.label}</span>
                ))}
              </p>
              <div className="article-links" aria-label="Resources">
                <a className="article-link" href="https://arxiv.org/html/2606.17055v1" rel="noopener noreferrer" target="_blank">
                  <FileText aria-hidden="true" size={16} strokeWidth={1.8} /> Paper
                </a>
                <a className="article-link" href="https://github.com/ZhuoyangLiu2005/T-Rex" rel="noopener noreferrer" target="_blank">
                  <Code aria-hidden="true" size={16} strokeWidth={1.8} /> Code
                </a>
              </div>
              <div className="article-logo-row" aria-label="Institution logos">
                {logos.map((logo) => (
                  <Image alt={logo.alt} className="article-logo-row__image" height={logo.h} key={logo.alt} src={logo.src} unoptimized width={logo.w} />
                ))}
              </div>
            </div>
          </header>

          {/* ---- Teaser figure ---- */}
          <figure className="trex-figure">
            <ZoomableImage className="fig-img" src="/figures/teaser.png" alt="T-Rex overview" width={4060} height={2393} />
            <figcaption>
              Figure 1: T-Rex overview — large-scale human egocentric pre-training plus tactile-grounded robot
              mid-training, a Mixture-of-Transformer model with a spatio-temporal tactile encoder, and a 100-hour
              tactile-rich dataset spanning 12 manipulation tasks.
            </figcaption>
          </figure>

          {/* ---- Abstract ---- */}
          <h2 id="abstract">Abstract</h2>
          <p>
            The ability to react dynamically to tactile signals has long been considered crucial to agile, human-level
            dexterity. Yet contemporary learning-based Vision-Language-Action (VLA) models for robotic manipulation
            generally either overlook the tactile modality altogether or are limited to encoders that capture only
            static cues. This gap stems from three obstacles: the scarcity of diverse training data and standardized
            evaluation, architectural constraints in current VLA models, and the limitations of static tactile encoders.
            T-Rex pushes the frontier of tactile-reactive manipulation by addressing all three. We open-source a
            large-scale, 100-hour tactile-rich dataset collected via a novel, data-efficient recipe that prioritizes
            elementary motor primitives. To exploit naturally high-frequency touch signals without sacrificing the
            capabilities of existing VLAs, we introduce a variable-rate <strong>Mixture-of-Transformer (MoT)</strong>{" "}
            architecture equipped with a novel <strong>temporal tactile VQ-VAE encoder</strong>. We demonstrate the
            effectiveness of tactile-reactive policies on 12 manipulation tasks requiring delicate force control and
            deformable-object manipulation, achieving over <strong>30% higher average success rate</strong> than the
            strongest baseline.
          </p>

          {/* ---- Contributions ---- */}
          <h2 id="contributions">Contributions</h2>
          <p>T-Rex redesigns the full pipeline across data, architecture, and real-world tasks:</p>
          <ul>
            <li><strong>The T-Rex Dataset</strong> — an open-source, 100-hour, tactile-synchronized teleoperation dataset organized around diverse object × motor-primitive combinations, filling the tactile gap in vision-only training data.</li>
            <li><strong>A three-stage training paradigm</strong> — human egocentric pre-training, tactile-rich mid-training, and lightweight fine-tuning — the first complete recipe for tactile dexterous manipulation.</li>
            <li><strong>The T-Rex Model</strong> — a variable-rate Mixture-of-Transformer that splits control into a low-rate action expert and a high-rate tactile expert providing reactive <em>residual</em> refinements.</li>
            <li><strong>A temporal tactile VQ-VAE encoder</strong> that compresses high-frequency touch into compact, drift-robust tokens of temporal force and contact patterns.</li>
            <li><strong>A 12-task real-world benchmark</strong> on a 58-DoF bimanual dexterous robot, spanning force control, deformation, and bimanual coordination — and <strong>state-of-the-art results</strong>, beating the strongest baseline by over 30% average success rate.</li>
          </ul>

          {/* ---- Dataset ---- */}
          <h2 id="dataset">The T-Rex Dataset</h2>
          <p>
            Most robot-manipulation datasets are built around parallel grippers or grasp-centric hands, offering limited
            coverage of tactile-rich interactions. The T-Rex Dataset is a large-scale, tactile-synchronized robot
            &ldquo;play&rdquo; corpus for mid-training. Rather than chasing a few long tasks, it follows a deliberately
            data-efficient recipe that prioritizes broad coverage of elementary motor primitives — short, reusable
            contact-rich behaviors that compose into complex skills. Every episode is structured around an{" "}
            <strong>object × motor-primitive</strong> combination: pairing 207 household objects with 22 motor primitives
            and pruning the physically infeasible pairs yields 502 unique, meaningful combinations, each with ~17
            demonstrations.
          </p>
          <p>
            Data is collected on a bimanual <strong>Dexmate Vega-1</strong> with two 7-DoF arms and two 22-DoF{" "}
            <strong>Sharpa Wave</strong> dexterous hands (five fingertip tactile sensors per hand). Perception combines a
            head ZED X Mini stereo camera with two wide-view wrist cameras; teleoperation uses Manus gloves and VIVE
            trackers routed through the same control pipeline used at deployment. Every episode is a time-aligned bundle
            at 30 Hz: three RGB streams, bimanual proprioception, SE(3) wrist poses, per-fingertip tactile (a deformation
            depth map plus a 6-axis wrench for all ten fingertips), and a language instruction — beneath a 300 Hz
            low-level control thread.
          </p>

          <div className="trex-stats">
            <div className="trex-stat"><div className="trex-stat__num">50h</div><div className="trex-stat__label">Open-Sourced Teleop Play</div></div>
            <div className="trex-stat"><div className="trex-stat__num">200+</div><div className="trex-stat__label">Daily Objects</div></div>
            <div className="trex-stat"><div className="trex-stat__num">22</div><div className="trex-stat__label">Motion Primitives</div></div>
            <div className="trex-stat"><div className="trex-stat__num">3</div><div className="trex-stat__label">Tactile Modalities</div></div>
          </div>

          <figure className="trex-figure">
            <div className="chart-grid">
              <div className="chart-cell">
                <ZoomableImage src="/figures/category_duration_pie.png" alt="Share of demonstration time across task categories" width={1933} height={1380} />
              </div>
              <div className="chart-cell">
                <ZoomableImage src="/figures/verb_frequency_chart_hours.png" alt="Hours of data per motor primitive" width={2179} height={981} />
              </div>
              <div className="chart-cell chart-cell--object">
                <ZoomableImage src="/figures/object_frequency_chart.png" alt="Demonstrations per object (long tail)" width={7466} height={1179} />
              </div>
            </div>
            <figcaption>
              T-Rex Dataset statistics — top-left: share of demonstration time across task categories; top-right: hours
              of data per motor primitive; bottom: the long-tail distribution of demonstrations across 200+ household
              objects.
            </figcaption>
          </figure>

          <h3 className="article-subsection" id="dataset-gallery">Explore the dataset</h3>
          <p>
            Browse a 500-trajectory random subset, filter by object and motion primitive, and resample on demand — all
            in your browser. Click the preview to open the full interactive visualizer.
          </p>
          <a className="ds-preview" href="visualizer/" aria-label="Open the interactive dataset visualizer">
            <iframe
              className="ds-preview__frame"
              src="visualizer/"
              title="T-Rex Dataset Visualizer preview"
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
            />
            <span className="ds-preview__overlay"><span>Open visualizer →</span></span>
          </a>
          <a className="ds-open" href="visualizer/">Open the dataset visualizer →</a>

          {/* ---- Architecture ---- */}
          <h2 id="architecture">Model &amp; Architecture</h2>
          <p>
            T-Rex is built around one idea: contact-rich dexterity needs <strong>two clocks running at once</strong>.
            Vision and language tell the robot what to do and roughly how to move, but they are too slow and too coarse
            to manage the millisecond-scale forces that decide whether an egg cracks, a card slips, or a bulb threads
            cleanly. T-Rex therefore splits the policy into a low-frequency visuomotor planning stream and a
            high-frequency tactile refinement stream, fused inside one shared transformer via a{" "}
            <strong>Mixture-of-Transformer-Experts</strong> backbone with three experts: a <strong>latent expert</strong>{" "}
            that predicts future visual representations, an <strong>action expert</strong> that plans a coarse action
            chunk, and a lightweight <strong>tactile expert</strong> that adds high-frequency residual corrections. The
            figure below shows how these experts fit together.
          </p>
          <figure className="trex-figure">
            <ZoomableImage className="fig-img" src="/figures/architecture.png" alt="T-Rex model architecture" width={3829} height={2898} />
            <figcaption>
              Figure 2: The T-Rex model — a variable-rate Mixture-of-Transformer with a latent expert, a slow action
              expert, and a fast, lightweight tactile expert that performs high-frequency residual refinement via an
              asynchronous cascaded flow-matching scheme.
            </figcaption>
          </figure>
          <p>
            The interaction is an <strong>asynchronous cascaded flow-matching</strong> scheme. The flow trajectory is
            split at τ = 0.4: the action expert integrates the upper segment (τ : 1 → 0.4) over 6 steps to produce a
            coarse plan, whose vision-language context is cached as a frozen snapshot. The tactile expert clones that
            cache and finishes the lower segment (τ : 0.4 → 0) over just 4 cheap steps, conditioned on live tactile
            tokens — and re-fires at intra-chunk offsets {"{0, 4, 8, 12}"}, four fast tactile ticks per slow visuomotor
            tick. Because the expensive vision/planning compute is amortized across many fast ticks, per-step cost is
            dominated by four lightweight tactile steps — fast enough for real closed-loop reaction.
          </p>

          <h3 className="article-subsection" id="tactile-encoder">Temporal tactile VQ-VAE encoder</h3>
          <p>
            Tactile feedback carries two complementary signals: <strong>temporal force dynamics</strong> (how contact
            forces evolve) and <strong>spatial contact geometry</strong> (edges, slip, shear). T-Rex encodes each
            separately. A per-finger <strong>VQ-VAE</strong> compresses a 16-frame window of raw 6-D force/torque through
            a 1D temporal convolutional encoder into a 256-D embedding, then vector-quantizes it to a learned codebook
            (K = 64) — one discrete, drift-robust token per finger. EMA codebook updates with periodic re-seeding prevent
            collapse, and a magnitude-weighted reconstruction loss keeps the codebook from collapsing onto the dominant
            no-contact state. The current unquantized force vector is also projected directly to preserve low-latency
            present-moment information, and a frozen ResNet-derived encoder turns each fingertip&rsquo;s deformation map
            into geometry-aware features. Concatenated, these form the tactile tokens the fast expert consumes — it never
            re-runs the vision tower.
          </p>

          <h3 className="article-subsection" id="training">Training recipe</h3>
          <p>
            T-Rex is trained in three stages that progressively transfer large-scale human priors into tactile-reactive
            control. <strong>(1) Human egocentric pre-training</strong> on 22,889 hours of first-person video gives the
            latent and action experts broad visuomotor and language priors (no tactile yet).{" "}
            <strong>(2) Tactile-grounded mid-training</strong> on the 100-hour T-Rex dataset adapts the action expert to
            robot observations and trains the tactile expert from scratch as a high-frequency refiner, with a delay
            augmentation that matches the visual/tactile staleness seen at deployment.{" "}
            <strong>(3) Skill-specific post-training</strong> fine-tunes on ~100 demonstrations per task. An auxiliary
            future-visual-prediction objective keeps the rapid tactile reflexes grounded in task context.
          </p>

          {/* ---- Demonstrations ---- */}
          <h2 id="demos">Demonstrations</h2>
          <p>
            Real-world autonomous policy rollouts on the bimanual dexterous platform. Pick a task to watch the policy
            execute it; click the video to expand it.
          </p>
          <DemoGallery />
          <a className="ds-open" href="tasks/">Browse all 12 tasks in detail →</a>

          {/* ---- Results ---- */}
          <h2 id="results">Results</h2>
          <p>
            T-Rex is evaluated against six representative dexterous-manipulation and VLA baselines on 12 tactile-reactive
            tasks spanning three difficulty families: force-sensitive contact, deformation-aware manipulation, and the
            hardest bimanual force-deformation tasks. Each task is evaluated over 16 randomized trials, with progress
            rubrics for multi-stage tasks. <strong>T-Rex is the top method on every one of the 12 tasks.</strong>
          </p>
          <ResultsBars figureNumber={3} />
          <p>
            Two findings stand out. First, <strong>large-scale pre-training is essential</strong>: policies trained from
            scratch on ~100 demos (ViTacFormer, RDP) collapse, while EgoScale&rsquo;s egocentric pre-training makes it
            the strongest baseline. Second, <strong>tactile integration must be done right</strong>: naively bolting
            tactile signals onto a pretrained VLA actually <em>hurts</em> (π0.5 + tactile scores below plain π0.5). T-Rex
            combines large-scale pre-training, tactile-grounded mid-training, and tactile-reactive control to win across
            the board.
          </p>

          <h3 className="article-subsection" id="per-task">Per-task results</h3>
          <ResultsTable figureNumber={4} />

          <h3 className="article-subsection" id="ablations">Ablations</h3>
          <p>
            Every component earns its place. Removing touch entirely is the most damaging; the temporal VQ-VAE force
            encoder, the asynchronous cascade, and both training stages each contribute measurably.
          </p>
          <AblationBars figureNumber={5} />

          {/* ---- Failure cases ---- */}
          <h2 id="failures">Failure cases</h2>
          <p>Six recurring failure modes point to where tactile-reactive dexterity still has headroom:</p>
          <div className="fail-grid">
            {FAILURE_CASES.map((f) => (
              <div className="fail-card" key={f.mode}>
                <span className="fail-card__tag">{f.mode}</span>
                <h4>{f.task}</h4>
                <p>{f.text}</p>
              </div>
            ))}
          </div>

          {/* ---- Limitations ---- */}
          <h2 id="limitations">Limitations &amp; future directions</h2>
          <ul>
            <li><strong>Hard, tightly-toleranced long-horizon tasks</strong> where good teleoperation is difficult — future work could add reinforcement learning or online refinement beyond behavior cloning.</li>
            <li><strong>Tactile hardware bottlenecks</strong> — sensor distortion, calibration drift across devices, and the absence of dense palm sensing for true whole-hand manipulation.</li>
            <li><strong>Toward unified, richer tactile sensing</strong> — representations that generalize across heterogeneous sensors, and whole-hand hardware with dense coverage beyond the fingertips.</li>
          </ul>

          {/* ---- Conclusion ---- */}
          <h2 id="conclusion">Conclusion</h2>
          <p>
            T-Rex brings large-scale pre-training and high-frequency touch together for contact-rich bimanual
            manipulation. A Mixture-of-Transformer model combines asynchronous tactile refinement with a temporal tactile
            VQ-VAE, processing touch at high frequency without slowing the main policy. Trained with human-video
            pre-training and an open-source 100-hour tactile-synchronized dataset, T-Rex outperforms existing dexterous
            and tactile-aware VLA baselines by an average of 30% across 12 real-world tactile-reactive tasks while
            substantially improving data efficiency — a practical recipe for tactile-reactive dexterous control.
          </p>

          {/* ---- Citation ---- */}
          <h2 id="citation">Citation</h2>
          <p>
            The T-Rex paper is available on{" "}
            <a href="https://arxiv.org/html/2606.17055v1" rel="noopener noreferrer" target="_blank">arXiv</a>. BibTeX, the
            dataset, and code will be posted here as they are released — feel free to link to{" "}
            <a href="https://tactile-reactive-dexterous.github.io" rel="noopener noreferrer" target="_blank">tactile-reactive-dexterous.github.io</a>.
          </p>
          <p style={{ fontSize: 15, color: "var(--trex-muted)" }}>
            This project page is built on the open-source{" "}
            <a href="https://github.com/enpire-research/enpire-research.github.io" rel="noopener noreferrer" target="_blank">ENPIRE</a>{" "}
            project-page template — many thanks to its authors.
          </p>
        </article>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="figure-page" data-theme="day">
      <TrexHero />
      <ArticleContent />
    </main>
  );
}
