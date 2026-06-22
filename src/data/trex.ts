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

// Per-object episode counts (success only) + category grouping, reproduced
// from dataset_summary.ipynb. Bar colours use the PIE palette (CATEGORY_DURATION)
// per category + a dark->light shade gradient by rank, so bars match the pie.
export type ObjBar = { name: string; label: string; count: number; color: string };
export const OBJECT_BARS: ObjBar[] = [
  { name: "bandage", label: "bandage", count: 56, color: "#e8918c" },
  { name: "stress_ball", label: "stress ball", count: 43, color: "#e8938e" },
  { name: "syringe", label: "syringe", count: 42, color: "#e9948f" },
  { name: "grip_strengthener", label: "grip strengthener", count: 36, color: "#e99691" },
  { name: "toothpaste", label: "toothpaste", count: 36, color: "#e99893" },
  { name: "soap", label: "soap", count: 32, color: "#ea9995" },
  { name: "lipstick", label: "lipstick", count: 30, color: "#ea9b96" },
  { name: "soap_box", label: "soap box", count: 30, color: "#ea9d98" },
  { name: "medicine_bottle", label: "medicine bottle", count: 22, color: "#eb9e9a" },
  { name: "hand_sanitizer", label: "hand sanitizer", count: 21, color: "#eba09c" },
  { name: "mirror", label: "mirror", count: 12, color: "#eba29d" },
  { name: "lint_roller_sheet", label: "lint roller sheet", count: 10, color: "#eca39f" },
  { name: "makeup_brush", label: "makeup brush", count: 10, color: "#eca5a1" },
  { name: "sanitizer", label: "sanitizer", count: 10, color: "#eca6a2" },
  { name: "surgical_tape", label: "surgical tape", count: 10, color: "#eda8a4" },
  { name: "bandaid", label: "bandaid", count: 8, color: "#edaaa6" },
  { name: "compact_mirror", label: "compact mirror", count: 6, color: "#eeaba8" },
  { name: "medicine_box", label: "medicine box", count: 4, color: "#eeada9" },
  { name: "foam_earplugs", label: "foam earplugs", count: 3, color: "#eeafab" },
  { name: "earplug", label: "earplug", count: 2, color: "#efb0ad" },
  { name: "pill_capsule", label: "pill capsule", count: 2, color: "#efb2ae" },
  { name: "cube", label: "cube", count: 30, color: "#efb45a" },
  { name: "toy_banana", label: "toy banana", count: 30, color: "#efb55d" },
  { name: "toy_tower_of_hanoi", label: "toy tower of hanoi", count: 30, color: "#f0b760" },
  { name: "legos", label: "legos", count: 28, color: "#f0b863" },
  { name: "toy_peg", label: "toy peg", count: 21, color: "#f0ba66" },
  { name: "toy_piano_key", label: "toy piano key", count: 20, color: "#f0bb69" },
  { name: "toy_pocket_knife", label: "toy pocket knife", count: 20, color: "#f1bc6d" },
  { name: "toy_train_track", label: "toy train track", count: 20, color: "#f1be70" },
  { name: "toy_train_tracks", label: "toy train tracks", count: 20, color: "#f1bf73" },
  { name: "bell", label: "bell", count: 14, color: "#f2c176" },
  { name: "basketball", label: "basketball", count: 13, color: "#f2c279" },
  { name: "handbell", label: "handbell", count: 12, color: "#f2c37c" },
  { name: "maracas", label: "maracas", count: 12, color: "#f3c57f" },
  { name: "piggy_bank", label: "piggy bank", count: 12, color: "#f3c682" },
  { name: "tambourine", label: "tambourine", count: 12, color: "#f3c885" },
  { name: "magnetic_blocks", label: "magnetic blocks", count: 4, color: "#f4c988" },
  { name: "train_tracks", label: "train tracks", count: 2, color: "#f4cb8c" },
  { name: "bubble_wrap", label: "bubble wrap", count: 80, color: "#aacf5a" },
  { name: "aluminum_foil", label: "aluminum foil", count: 72, color: "#abd05d" },
  { name: "plastic_wrap", label: "plastic wrap", count: 62, color: "#add160" },
  { name: "adhesive_wrap", label: "adhesive wrap", count: 50, color: "#aed263" },
  { name: "tape", label: "tape", count: 50, color: "#b0d266" },
  { name: "cling_film", label: "cling film", count: 36, color: "#b2d369" },
  { name: "glue", label: "glue", count: 30, color: "#b3d46b" },
  { name: "cellophane", label: "cellophane", count: 29, color: "#b4d56e" },
  { name: "construction_paper", label: "construction paper", count: 24, color: "#b6d671" },
  { name: "wrapping_paper", label: "wrapping paper", count: 23, color: "#b8d774" },
  { name: "duck_tape", label: "duck tape", count: 21, color: "#b9d777" },
  { name: "parchment_paper", label: "parchment paper", count: 20, color: "#bad87a" },
  { name: "foil", label: "foil", count: 11, color: "#bcd97d" },
  { name: "masking_tape", label: "masking tape", count: 10, color: "#beda80" },
  { name: "origami_paper", label: "origami paper", count: 5, color: "#bfdb83" },
  { name: "crepe_paper", label: "crepe paper", count: 2, color: "#c0dc86" },
  { name: "glue_bottle", label: "glue bottle", count: 2, color: "#c2dd89" },
  { name: "window_cling", label: "window cling", count: 2, color: "#c3dd8c" },
  { name: "airpods", label: "airpods", count: 82, color: "#5cb85c" },
  { name: "button", label: "button", count: 64, color: "#5eb95e" },
  { name: "flip_phone", label: "flip phone", count: 58, color: "#5fba5f" },
  { name: "camera", label: "camera", count: 42, color: "#61ba61" },
  { name: "ethernet_cable", label: "ethernet cable", count: 41, color: "#63bb63" },
  { name: "switch_on_off", label: "switch on off", count: 39, color: "#65bc65" },
  { name: "keyboard", label: "keyboard", count: 35, color: "#66bd66" },
  { name: "calculator", label: "calculator", count: 32, color: "#68bd68" },
  { name: "phone", label: "phone", count: 31, color: "#6abe6a" },
  { name: "file_adapter", label: "file adapter", count: 24, color: "#6cbf6c" },
  { name: "router", label: "router", count: 22, color: "#6dc06d" },
  { name: "timer", label: "timer", count: 20, color: "#6fc06f" },
  { name: "usb_cable", label: "usb cable", count: 20, color: "#71c171" },
  { name: "joystick", label: "joystick", count: 19, color: "#73c273" },
  { name: "laptop", label: "laptop", count: 15, color: "#74c374" },
  { name: "tv_remote", label: "tv remote", count: 13, color: "#76c376" },
  { name: "cable", label: "cable", count: 12, color: "#78c478" },
  { name: "mouse", label: "mouse", count: 12, color: "#7ac57a" },
  { name: "speaker", label: "speaker", count: 11, color: "#7bc67b" },
  { name: "calculator_key", label: "calculator key", count: 10, color: "#7dc67d" },
  { name: "screen_protector", label: "screen protector", count: 10, color: "#7fc77f" },
  { name: "side_button", label: "side button", count: 8, color: "#81c881" },
  { name: "stopwatch", label: "stopwatch", count: 8, color: "#82c982" },
  { name: "power_adapter", label: "power adapter", count: 5, color: "#84c984" },
  { name: "charging_cable", label: "charging cable", count: 4, color: "#86ca86" },
  { name: "plug", label: "plug", count: 4, color: "#88cb88" },
  { name: "battery", label: "battery", count: 2, color: "#89cc89" },
  { name: "flashlight", label: "flashlight", count: 2, color: "#8bcd8b" },
  { name: "on_off_switch", label: "on off switch", count: 2, color: "#8dcd8d" },
  { name: "measuring_cup", label: "measuring cup", count: 43, color: "#4fb0a5" },
  { name: "almond", label: "almond", count: 30, color: "#52b1a6" },
  { name: "condiment", label: "condiment", count: 30, color: "#55b2a8" },
  { name: "sugar", label: "sugar", count: 30, color: "#57b4a9" },
  { name: "pipette", label: "pipette", count: 26, color: "#5ab5ab" },
  { name: "coffee_filter", label: "coffee filter", count: 20, color: "#5db6ac" },
  { name: "knife", label: "knife", count: 20, color: "#60b7ae" },
  { name: "spoon", label: "spoon", count: 20, color: "#62b9af" },
  { name: "fork", label: "fork", count: 19, color: "#65bab0" },
  { name: "sandwich_press", label: "sandwich press", count: 16, color: "#68bbb2" },
  { name: "beaker", label: "beaker", count: 14, color: "#6bbcb3" },
  { name: "glass_cup", label: "glass cup", count: 12, color: "#6ebeb5" },
  { name: "tweezers", label: "tweezers", count: 7, color: "#70bfb6" },
  { name: "dish", label: "dish", count: 5, color: "#73c0b7" },
  { name: "kettle", label: "kettle", count: 3, color: "#76c1b9" },
  { name: "oil_cruet", label: "oil cruet", count: 2, color: "#79c3ba" },
  { name: "pitcher", label: "pitcher", count: 2, color: "#7bc4bc" },
  { name: "tea", label: "tea", count: 2, color: "#7ec5bd" },
  { name: "test_tube", label: "test tube", count: 2, color: "#81c6bf" },
  { name: "watering_can", label: "watering can", count: 2, color: "#84c8c0" },
  { name: "air_blower", label: "air blower", count: 48, color: "#8fbfe0" },
  { name: "key", label: "key", count: 31, color: "#91c0e1" },
  { name: "screw", label: "screw", count: 30, color: "#94c2e1" },
  { name: "screwdriver", label: "screwdriver", count: 30, color: "#96c3e2" },
  { name: "scissors", label: "scissors", count: 29, color: "#99c4e3" },
  { name: "toolbox", label: "toolbox", count: 20, color: "#9bc6e3" },
  { name: "matches", label: "matches", count: 15, color: "#9dc7e4" },
  { name: "box_of_matches", label: "box of matches", count: 12, color: "#a0c9e5" },
  { name: "table", label: "table", count: 12, color: "#a2cae5" },
  { name: "combination_lock", label: "combination lock", count: 10, color: "#a5cbe6" },
  { name: "zip_tie", label: "zip tie", count: 10, color: "#a7cde7" },
  { name: "foldable_board", label: "foldable board", count: 4, color: "#a9cee7" },
  { name: "pipe", label: "pipe", count: 4, color: "#accfe8" },
  { name: "keycard", label: "keycard", count: 2, color: "#aed1e9" },
  { name: "pvc_pipes", label: "pvc pipes", count: 2, color: "#b1d2e9" },
  { name: "clamshell_container", label: "clamshell container", count: 62, color: "#7b8fd4" },
  { name: "dispenser_bottle", label: "dispenser bottle", count: 61, color: "#7d90d5" },
  { name: "bowl", label: "bowl", count: 53, color: "#7e92d5" },
  { name: "bottle_cap", label: "bottle cap", count: 52, color: "#8093d6" },
  { name: "drawer", label: "drawer", count: 52, color: "#8194d6" },
  { name: "bottle", label: "bottle", count: 41, color: "#8396d7" },
  { name: "cup", label: "cup", count: 37, color: "#8597d7" },
  { name: "jar_lid", label: "jar lid", count: 34, color: "#8698d8" },
  { name: "jewelry_box", label: "jewelry box", count: 34, color: "#889ad8" },
  { name: "glasses_case", label: "glasses case", count: 33, color: "#899bd9" },
  { name: "carafe", label: "carafe", count: 32, color: "#8b9cd9" },
  { name: "package", label: "package", count: 30, color: "#8c9eda" },
  { name: "pen_bag", label: "pen bag", count: 30, color: "#8e9fda" },
  { name: "pencil_case", label: "pencil case", count: 24, color: "#90a0db" },
  { name: "bucket", label: "bucket", count: 23, color: "#91a2db" },
  { name: "paper_plate", label: "paper plate", count: 20, color: "#93a3dc" },
  { name: "plate", label: "plate", count: 13, color: "#94a5dc" },
  { name: "plastic_plate", label: "plastic plate", count: 12, color: "#96a6dd" },
  { name: "paper_bag", label: "paper bag", count: 10, color: "#98a7dd" },
  { name: "water_bottle", label: "water bottle", count: 10, color: "#99a9de" },
  { name: "lunch_bag", label: "lunch bag", count: 8, color: "#9baade" },
  { name: "egg_carton", label: "egg carton", count: 4, color: "#9cabdf" },
  { name: "hinged_tin", label: "hinged tin", count: 4, color: "#9eaddf" },
  { name: "spray_bottle", label: "spray bottle", count: 4, color: "#9faee0" },
  { name: "mustard_cap", label: "mustard cap", count: 2, color: "#a1afe0" },
  { name: "carafe_lid", label: "carafe lid", count: 1, color: "#a3b1e1" },
  { name: "sponge", label: "sponge", count: 62, color: "#9b8fd0" },
  { name: "napkin", label: "napkin", count: 54, color: "#9c90d1" },
  { name: "scarf", label: "scarf", count: 52, color: "#9e92d1" },
  { name: "tissue", label: "tissue", count: 50, color: "#9f93d2" },
  { name: "ribbon", label: "ribbon", count: 48, color: "#a095d2" },
  { name: "cloth", label: "cloth", count: 41, color: "#a296d3" },
  { name: "string", label: "string", count: 41, color: "#a398d4" },
  { name: "muslin", label: "muslin", count: 34, color: "#a499d4" },
  { name: "velcro_strap", label: "velcro strap", count: 33, color: "#a59bd5" },
  { name: "bandana", label: "bandana", count: 32, color: "#a79cd6" },
  { name: "paper_towel", label: "paper towel", count: 32, color: "#a89ed6" },
  { name: "cheesecloth", label: "cheesecloth", count: 30, color: "#a99fd7" },
  { name: "memory_foam", label: "memory foam", count: 29, color: "#aba1d7" },
  { name: "towel", label: "towel", count: 29, color: "#aca2d8" },
  { name: "arm_wrap", label: "arm wrap", count: 23, color: "#ada3d9" },
  { name: "netting", label: "netting", count: 22, color: "#afa5d9" },
  { name: "sash", label: "sash", count: 22, color: "#b0a6da" },
  { name: "gel_pad", label: "gel pad", count: 20, color: "#b1a8da" },
  { name: "thread", label: "thread", count: 20, color: "#b2a9db" },
  { name: "felt_sheet", label: "felt sheet", count: 15, color: "#b4abdc" },
  { name: "handkerchief", label: "handkerchief", count: 12, color: "#b5acdc" },
  { name: "yarn", label: "yarn", count: 10, color: "#b6aedd" },
  { name: "straw", label: "straw", count: 5, color: "#b8afdd" },
  { name: "tissue_paper", label: "tissue paper", count: 2, color: "#b9b1de" },
  { name: "book", label: "book", count: 82, color: "#c9a8d8" },
  { name: "whiteboard", label: "whiteboard", count: 61, color: "#caa9d8" },
  { name: "coin", label: "coin", count: 60, color: "#caaad9" },
  { name: "paper", label: "paper", count: 51, color: "#cbabd9" },
  { name: "bumper_sticker", label: "bumper sticker", count: 42, color: "#cbacda" },
  { name: "stapler", label: "stapler", count: 41, color: "#ccadda" },
  { name: "map", label: "map", count: 39, color: "#cdaedb" },
  { name: "sticky_note", label: "sticky note", count: 38, color: "#cdafdb" },
  { name: "card", label: "card", count: 30, color: "#ceb0db" },
  { name: "marker", label: "marker", count: 30, color: "#ceb1dc" },
  { name: "pen", label: "pen", count: 30, color: "#cfb2dc" },
  { name: "receipt_paper", label: "receipt paper", count: 30, color: "#d0b3dd" },
  { name: "sticker", label: "sticker", count: 29, color: "#d0b4dd" },
  { name: "photo_album", label: "photo album", count: 24, color: "#d1b5de" },
  { name: "dollar_bill", label: "dollar bill", count: 22, color: "#d1b6de" },
  { name: "shipping_label", label: "shipping label", count: 22, color: "#d2b6de" },
  { name: "file", label: "file", count: 20, color: "#d3b7df" },
  { name: "paper_clamp", label: "paper clamp", count: 12, color: "#d3b8df" },
  { name: "envelope_seal", label: "envelope seal", count: 10, color: "#d4b9e0" },
  { name: "postage_stamp", label: "postage stamp", count: 10, color: "#d4bae0" },
  { name: "folder", label: "folder", count: 4, color: "#d5bbe1" },
  { name: "paper_clip", label: "paper clip", count: 4, color: "#d6bce1" },
  { name: "pen_and_cap", label: "pen and cap", count: 4, color: "#d6bde2" },
  { name: "textbook", label: "textbook", count: 4, color: "#d7bee2" },
  { name: "canvas_paper", label: "canvas paper", count: 2, color: "#d7bfe2" },
  { name: "envelope", label: "envelope", count: 2, color: "#d8c0e3" },
  { name: "penn_cap", label: "penn cap", count: 1, color: "#d9c1e3" },
  { name: "receipt", label: "receipt", count: 1, color: "#d9c2e4" },
  { name: "backpack", label: "backpack", count: 71, color: "#e87ab0" },
  { name: "shorts", label: "shorts", count: 68, color: "#e97eb2" },
  { name: "glasses", label: "glasses", count: 44, color: "#e981b4" },
  { name: "hoodie", label: "hoodie", count: 32, color: "#ea85b6" },
  { name: "shirt", label: "shirt", count: 30, color: "#eb89b9" },
  { name: "jacket", label: "jacket", count: 29, color: "#eb8cbb" },
  { name: "long_pants", label: "long pants", count: 28, color: "#ec90bd" },
  { name: "coat", label: "coat", count: 21, color: "#ec93bf" },
  { name: "belt", label: "belt", count: 20, color: "#ed97c1" },
  { name: "shoe", label: "shoe", count: 20, color: "#ee9bc3" },
  { name: "hair_clip", label: "hair clip", count: 18, color: "#ee9ec6" },
  { name: "apron", label: "apron", count: 12, color: "#efa2c8" },
];
export type ObjCatSpan = { cat: string; start: number; end: number; color: string };
export const OBJECT_CAT_SPANS: ObjCatSpan[] = [
  { cat: "Personal Care", start: 0, end: 20, color: "#e8918c" },
  { cat: "Toys", start: 21, end: 37, color: "#efb45a" },
  { cat: "Wrapping & Tape", start: 38, end: 55, color: "#aacf5a" },
  { cat: "Electronics", start: 56, end: 84, color: "#5cb85c" },
  { cat: "Kitchen", start: 85, end: 104, color: "#4fb0a5" },
  { cat: "Hardware & Tools", start: 105, end: 119, color: "#8fbfe0" },
  { cat: "Containers", start: 120, end: 145, color: "#7b8fd4" },
  { cat: "Fabric & Cloth", start: 146, end: 169, color: "#9b8fd0" },
  { cat: "Paper & Writing", start: 170, end: 197, color: "#c9a8d8" },
  { cat: "Clothing", start: 198, end: 209, color: "#e87ab0" },
];
