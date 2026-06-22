// ============================================================================
// T-Rex shared data: video URLs, the 12 tasks, results, ablations, dataset.
// Videos are streamed from the existing Hugging Face dataset (same host the
// previous T-Rex site used) so the repo stays small and GitHub-Pages friendly.
// ============================================================================

export const HF_BASE = "https://huggingface.co/datasets/Beakerman0101/trex-visualizer/resolve/main";

export const hf = {
  overview: `${HF_BASE}/overview/trex_overview.mp4`,
  speed: (file: string) => `${HF_BASE}/task_demos_speed/${file}`,
  head: (slug: string) => `${HF_BASE}/task_videos/${slug}_head_2x.mp4`,
  // Third-person clips are not on HF yet — upload the files in
  // T-Rex/task_demo_third_view/ to this path to light up the second view.
  thirdView: (file: string) => `${HF_BASE}/task_demos_third_view/${file}`,
  datasetClip: (file: string) => `${HF_BASE}/${file}`,
  datasetCsv: `${HF_BASE}/metadata.csv`,
};

export type TaskCategory = "force" | "deform" | "bimanual";

export const CATEGORY_LABEL: Record<TaskCategory, string> = {
  force: "Force-sensitive contact",
  deform: "Deformation-aware",
  bimanual: "Bimanual force–deformation",
};

export type DemoTask = {
  id: string;
  name: string;
  category: TaskCategory;
  instruction: string;
  // main demo clip (5x), head/front view — already hosted on HF
  mainFile?: string;
  // third-person clip filename to upload to HF (task_demos_third_view/)
  thirdFile?: string;
};

// The 12 tactile-reactive manipulation tasks (instructions verbatim from the
// paper / previous site). `mainFile` 5x clips + head loops are already on HF;
// `thirdFile` clips need to be uploaded to enable the second camera view.
export const DEMO_TASKS: DemoTask[] = [
  {
    id: "flip_page",
    name: "Flip Page",
    category: "force",
    instruction: "Turn a page of the book from right to left using your right index finger.",
    mainFile: "flip_page_3_final_5x.mp4",
  },
  {
    id: "transfer_egg",
    name: "Transfer Egg",
    category: "force",
    instruction:
      "Using the right thumb and index finger, pick up the egg from the green egg tray and place it into the yellow egg tray.",
    mainFile: "transfer_egg_1_final_5x.mp4",
    thirdFile: "pick_egg_1.mp4",
  },
  {
    id: "wipe_plate",
    name: "Wipe Plate",
    category: "force",
    instruction:
      "There is a white plate and a white cloth on the table; the white plate has colored stains on it. Use your right hand to pick up the cloth, hold the plate steady with your left hand, and then use the cloth to wipe away the stains.",
    mainFile: "wipe_plate_2_final_5x.mp4",
  },
  {
    id: "apply_toothpaste",
    name: "Apply Toothpaste",
    category: "force",
    instruction:
      "On the left side of the countertop sits a cup holding a toothbrush, while an open tube of toothpaste rests on the right. Pick up the toothbrush with your left hand and the toothpaste with your right, squeeze some toothpaste onto the brush, and then set the tube back down.",
    mainFile: "apply_toothpaste_2_final_5x.mp4",
    thirdFile: "apply_toothpaste_1.mp4",
  },
  {
    id: "split_cup",
    name: "Split Cup",
    category: "deform",
    instruction:
      "A stack of red plastic cups sits on the desktop; use the right hand to slide out the topmost one, exerting effort to separate it from the rest of the stack.",
    mainFile: "split_cup_2_final_5x.mp4",
    thirdFile: "remove_cup_1.mp4",
  },
  {
    id: "sort_mahjong",
    name: "Sort Mahjong",
    category: "deform",
    instruction:
      "Three boxes are placed on the table, representing the Mahjong tiles 'Red Zhong', 'Green Fa', and 'White Blank', respectively. In the center of the table lies a single Mahjong tile, placed face-down. Now, using your right hand, grasp the tile and discern its pattern; then, use your left hand to open the box corresponding to that pattern and place the tile inside.",
    mainFile: "sort_mahjong_1_final_5x.mp4",
    thirdFile: "sort_mahjong.mp4",
  },
  {
    id: "open_lock",
    name: "Open Lock",
    category: "deform",
    instruction:
      "On the left side of the desk lies a red book, atop which rests a gray key; on the right side is a lock. Using your left thumb and index finger, slide the key free; then, pick up the lock with your right hand and use the key to unlock it.",
    mainFile: "open_lock_1_final_5x.mp4",
    thirdFile: "open_lock.mp4",
  },
  {
    id: "refill_tablet",
    name: "Refill Tablet",
    category: "deform",
    instruction:
      "Use your left hand to open one of the compartments in the small box, use your right hand to grasp the small ball on the table, place the ball into the box, and then close the box.",
  },
  {
    id: "acid_base",
    name: "Acid-Base Neutralization",
    category: "bimanual",
    instruction:
      "On the right side of the desktop stands an Erlenmeyer flask containing 200 mL of citric acid solution; on the left is a beaker holding 20 mL of NaOH solution with bromothymol blue indicator — appearing blue due to its alkaline nature. Using your right hand, pick up the dropper and draw up about 5 mL of the acid solution; then, using your left hand to hold the beaker, perform an acid-base titration until the liquid turns green or yellow.",
    mainFile: "acid_base_1_final_5x.mp4",
    thirdFile: "acid_base_1.mp4",
  },
  {
    id: "extract_card",
    name: "Extract Card",
    category: "bimanual",
    instruction:
      "Next to the cube on the table lies a card case containing two cards. Pick up the case with the left hand, then use the right thumb to slide the cards out through the central opening; subsequently, use the right thumb and index finger to slide out the first card, taking care not to pull out the second one.",
    mainFile: "extract_card_1_final_5x.mp4",
    thirdFile: "remove_card_1.mp4",
  },
  {
    id: "deal_poker",
    name: "Deal Poker",
    category: "bimanual",
    instruction:
      "Pick up a stack of playing cards with your right hand, then transfer it to your left; hold the stack aloft with your left hand, use your right thumb to slide out the top card, grasp it, and place it into the card holder.",
  },
  {
    id: "screw_lightbulb",
    name: "Screw Lightbulb",
    category: "bimanual",
    instruction:
      "There is a lightbulb and a base on the desktop. Use your left hand to pick up the lightbulb and transfer it to your right hand; then, use your left hand to hold down the base while using your right hand to screw the lightbulb into the base until it lights up.",
    mainFile: "screw_lightbulb_1_final_5x.mp4",
    thirdFile: "screw_lightbulb.mp4",
  },
];

// ---- Results: macro-average success (%) per method (for animated bars) ------
export type MethodAvg = { method: string; avg: number; highlight?: boolean };
export const RESULTS_AVG: MethodAvg[] = [
  { method: "T-Rex (Ours)", avg: 65, highlight: true },
  { method: "EgoScale", avg: 35 },
  { method: "π0.5", avg: 17 },
  { method: "Tactile-VLA", avg: 15 },
  { method: "RDP", avg: 6 },
  { method: "π0.5 + tactile", avg: 6 },
  { method: "ViTacFormer", avg: 3 },
];

// ---- Per-task success table (%) ---------------------------------------------
export const TASK_COLUMNS = [
  { key: "flip", label: "Flip Page", cat: "force" },
  { key: "egg", label: "Transfer Egg", cat: "force" },
  { key: "wipe", label: "Wipe Plate", cat: "force" },
  { key: "paste", label: "Apply Paste", cat: "force" },
  { key: "cup", label: "Split Cup", cat: "deform" },
  { key: "mahjong", label: "Sort Mahjong", cat: "deform" },
  { key: "lock", label: "Open Lock", cat: "deform" },
  { key: "tablet", label: "Refill Tablet", cat: "deform" },
  { key: "acid", label: "Acid-Base", cat: "bimanual" },
  { key: "card", label: "Extract Card", cat: "bimanual" },
  { key: "poker", label: "Deal Poker", cat: "bimanual" },
  { key: "bulb", label: "Screw Bulb", cat: "bimanual" },
] as const;

export type ResultRow = { method: string; ours?: boolean; vals: number[]; avg: number };
// order matches TASK_COLUMNS
export const RESULTS_TABLE: ResultRow[] = [
  { method: "ViTacFormer", vals: [9, 0, 4, 1, 4, 7, 0, 0, 0, 2, 2, 1], avg: 3 },
  { method: "RDP", vals: [12, 8, 18, 2, 6, 9, 2, 0, 0, 1, 2, 7], avg: 6 },
  { method: "Tactile-VLA", vals: [38, 14, 24, 0, 21, 27, 8, 0, 9, 4, 11, 18], avg: 15 },
  { method: "π0.5", vals: [36, 17, 28, 13, 18, 32, 5, 1, 24, 8, 9, 11], avg: 17 },
  { method: "π0.5 + tactile", vals: [8, 9, 27, 2, 4, 14, 2, 0, 7, 3, 0, 0], avg: 6 },
  { method: "EgoScale", vals: [68, 44, 34, 38, 33, 36, 19, 12, 43, 41, 28, 18], avg: 35 },
  { method: "T-Rex (Ours)", ours: true, vals: [96, 75, 69, 66, 78, 65, 47, 41, 76, 70, 57, 35], avg: 65 },
];

// ---- Ablations (6 representative tasks; we show the averages as bars) --------
export type AblationGroup = { title: string; note?: string; rows: { name: string; avg: number; full?: boolean }[] };
export const ABLATIONS: AblationGroup[] = [
  {
    title: "Tactile modality & encoding",
    note: "Removing touch entirely is the most damaging (−23 pts); the temporal VQ-VAE force encoder is what makes touch pay off.",
    rows: [
      { name: "Full model (Ours)", avg: 65, full: true },
      { name: "MLP force + VQ-VAE force", avg: 59 },
      { name: "MLP force + deform", avg: 58 },
      { name: "Deformation only", avg: 54 },
      { name: "w/o Tactile", avg: 42 },
    ],
  },
  {
    title: "Asynchronous cascaded flow matching",
    note: "Decoupling low-frequency planning from high-frequency tactile refinement gives a consistent +5 pts.",
    rows: [
      { name: "Full model (Ours)", avg: 65, full: true },
      { name: "w/o Async (synchronous)", avg: 60 },
    ],
  },
  {
    title: "Training recipe (pre-train × mid-train)",
    note: "From an 18-pt scratch baseline, tactile-grounded mid-training and human pre-training each help; together they reach the full recipe.",
    rows: [
      { name: "Pre-train ✓ + Mid-train ✓", avg: 67, full: true },
      { name: "Pre-train ✓ only", avg: 45 },
      { name: "Mid-train ✓ only", avg: 34 },
      { name: "From scratch", avg: 18 },
    ],
  },
];

// ---- Dataset gallery: curated fallback clips (used if metadata.csv fails) ----
export type DatasetClip = { file: string; verb: string; object: string };
export const DATASET_FALLBACK: DatasetClip[] = [
  { file: "videos/fold__aluminum_foil__01495.mp4", verb: "fold", object: "aluminum foil" },
  { file: "videos/wrap__cable__01532.mp4", verb: "wrap", object: "cable" },
  { file: "videos/peel__bandaid__01546.mp4", verb: "peel", object: "bandaid" },
  { file: "videos/press__bumper_sticker__01598.mp4", verb: "press", object: "bumper sticker" },
  { file: "videos/squeeze__air_blower__01632.mp4", verb: "squeeze", object: "air blower" },
  { file: "videos/wipe__book__01648.mp4", verb: "wipe", object: "book" },
  { file: "videos/open__clamshell_container__01762.mp4", verb: "open", object: "clamshell container" },
  { file: "videos/cut__origami_paper__01573.mp4", verb: "cut", object: "origami paper" },
  { file: "videos/pour__carafe__01700.mp4", verb: "pour", object: "carafe" },
  { file: "videos/insert__battery__01809.mp4", verb: "insert", object: "battery" },
  { file: "videos/screw__carafe_lid__01985.mp4", verb: "screw", object: "carafe lid" },
  { file: "videos/shake__box_of_matches__01716.mp4", verb: "shake", object: "box of matches" },
];

// ---- Failure cases ----------------------------------------------------------
export const FAILURE_CASES = [
  { task: "Screw Lightbulb", mode: "Object collision", text: "After grasping the bulb, the right hand collides it with the base instead of inserting — a lack of fine visual alignment and overly rapid motion." },
  { task: "Open Lock", mode: "Slipping off", text: "The key is grasped but slips during later steps, reflecting limited fine in-hand dexterity tied to the teleoperated data distribution." },
  { task: "Transfer Egg", mode: "Imprecise position", text: "The egg is grasped intact via force feedback but mis-placed into the tray — behavior-cloning distribution shift." },
  { task: "Sort Mahjong", mode: "Multi-finger friction", text: "A too-low thumb contacts an adjacent tile and opens two boxes, indicating insufficient per-finger coordination." },
  { task: "Apply Toothpaste", mode: "Excessive force", text: "Too much paste is squeezed out and missed by the brush — overly forceful control on deformable objects." },
  { task: "Extract Card", mode: "Sliding misalignment", text: "Non-uniform force while sliding the card out, suggesting a need for stronger temporal tactile conditioning." },
];

// ---- Dataset composition charts (values from the v10 dataset-summary run, the
// same data behind the static category_duration_pie / verb_frequency PNGs). ----

// Demonstration hours per task category (success-only). All 10 values are
// EXACT — printed verbatim by the v10 run ("Containers 7.23 h", ...) and their
// shares reproduce the published pie (Containers/Wrapping 14.0%, Fabric 13.3%,
// Paper 12.3%, Electronics 9.7%, Toys 8.6%, Personal Care 7.9%, Hardware 7.5%,
// Clothing 6.7%, Kitchen 6.0%). Order = the figure's own _PIE_ORDER; colours
// mirror the pastel palette of the original pie.
export type CategorySlice = { name: string; hours: number; color: string };
export const CATEGORY_DURATION: CategorySlice[] = [
  { name: "Personal Care", hours: 4.07, color: "#e8918c" },
  { name: "Hardware & Tools", hours: 3.86, color: "#8fbfe0" },
  { name: "Toys", hours: 4.43, color: "#efb45a" },
  { name: "Kitchen", hours: 3.06, color: "#4fb0a5" },
  { name: "Wrapping & Tape", hours: 7.19, color: "#aacf5a" },
  { name: "Electronics", hours: 5.0, color: "#5cb85c" },
  { name: "Fabric & Cloth", hours: 6.85, color: "#9b8fd0" },
  { name: "Clothing", hours: 3.43, color: "#e87ab0" },
  { name: "Containers", hours: 7.23, color: "#7b8fd4" },
  { name: "Paper & Writing", hours: 6.33, color: "#c9a8d8" },
];

// Demonstration hours per motion primitive (success-only), descending.
// The first 15 are EXACT — printed verbatim by the v10 run. The 7-verb tail
// (disassemble … unscrew) is NOT printed individually anywhere (the run lumps
// it into "Others = 8.34 h"), so each tail value is MEASURED off the published
// verb_frequency_chart_hours.png: bar pixel-heights calibrated at 110.2 px/h by
// linear fit to the 15 exact bars (which the fit reproduces to ±0.01 h). The
// tail sums to 8.25 h vs the printed 8.34 h — agreement within pixel rounding.
export type VerbHours = { verb: string; hours: number; measured?: boolean };
export const VERB_HOURS: VerbHours[] = [
  { verb: "wrap", hours: 6.11 },
  { verb: "lift and place", hours: 5.47 },
  { verb: "grasp and lift", hours: 4.61 },
  { verb: "fold", hours: 4.09 },
  { verb: "cut", hours: 2.81 },
  { verb: "reach", hours: 2.64 },
  { verb: "insert", hours: 2.28 },
  { verb: "press", hours: 2.17 },
  { verb: "wipe", hours: 2.08 },
  { verb: "peel", hours: 2.03 },
  { verb: "assemble", hours: 1.96 },
  { verb: "extract", hours: 1.84 },
  { verb: "twist", hours: 1.76 },
  { verb: "shake", hours: 1.66 },
  { verb: "dispense", hours: 1.6 },
  { verb: "disassemble", hours: 1.44, measured: true },
  { verb: "squeeze", hours: 1.42, measured: true },
  { verb: "pour", hours: 1.34, measured: true },
  { verb: "open", hours: 1.29, measured: true },
  { verb: "close", hours: 1.05, measured: true },
  { verb: "screw", hours: 1.02, measured: true },
  { verb: "unscrew", hours: 0.69, measured: true },
];
