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
// exactly from dataset_summary.ipynb (same aliases, categorisation, order,
// and desaturated-Plotly colours as object_frequency_chart.png).
export type ObjBar = { name: string; label: string; count: number; color: string };
export const OBJECT_BARS: ObjBar[] = [
  { name: "bandage", label: "bandage", count: 56, color: "#6b74f2" },
  { name: "stress_ball", label: "stress ball", count: 43, color: "#6d77f3" },
  { name: "syringe", label: "syringe", count: 42, color: "#6f79f3" },
  { name: "grip_strengthener", label: "grip strengthener", count: 36, color: "#717bf3" },
  { name: "toothpaste", label: "toothpaste", count: 36, color: "#737df3" },
  { name: "soap", label: "soap", count: 32, color: "#767ff3" },
  { name: "lipstick", label: "lipstick", count: 30, color: "#7881f4" },
  { name: "soap_box", label: "soap box", count: 30, color: "#7a83f4" },
  { name: "medicine_bottle", label: "medicine bottle", count: 22, color: "#7c85f4" },
  { name: "hand_sanitizer", label: "hand sanitizer", count: 21, color: "#7f87f4" },
  { name: "mirror", label: "mirror", count: 12, color: "#8189f4" },
  { name: "lint_roller_sheet", label: "lint roller sheet", count: 10, color: "#838bf5" },
  { name: "makeup_brush", label: "makeup brush", count: 10, color: "#858df5" },
  { name: "sanitizer", label: "sanitizer", count: 10, color: "#878ff5" },
  { name: "surgical_tape", label: "surgical tape", count: 10, color: "#8a92f5" },
  { name: "bandaid", label: "bandaid", count: 8, color: "#8c94f5" },
  { name: "compact_mirror", label: "compact mirror", count: 6, color: "#8e96f5" },
  { name: "medicine_box", label: "medicine box", count: 4, color: "#9098f6" },
  { name: "foam_earplugs", label: "foam earplugs", count: 3, color: "#939af6" },
  { name: "earplug", label: "earplug", count: 2, color: "#959cf6" },
  { name: "pill_capsule", label: "pill capsule", count: 2, color: "#979ef6" },
  { name: "cube", label: "cube", count: 30, color: "#e65b44" },
  { name: "toy_banana", label: "toy banana", count: 30, color: "#e65e48" },
  { name: "toy_tower_of_hanoi", label: "toy tower of hanoi", count: 30, color: "#e7624b" },
  { name: "legos", label: "legos", count: 28, color: "#e7654f" },
  { name: "toy_peg", label: "toy peg", count: 21, color: "#e86852" },
  { name: "toy_piano_key", label: "toy piano key", count: 20, color: "#e86b56" },
  { name: "toy_pocket_knife", label: "toy pocket knife", count: 20, color: "#e96e59" },
  { name: "toy_train_track", label: "toy train track", count: 20, color: "#e9715d" },
  { name: "toy_train_tracks", label: "toy train tracks", count: 20, color: "#ea7460" },
  { name: "bell", label: "bell", count: 14, color: "#ea7764" },
  { name: "basketball", label: "basketball", count: 13, color: "#eb7a67" },
  { name: "handbell", label: "handbell", count: 12, color: "#eb7d6b" },
  { name: "maracas", label: "maracas", count: 12, color: "#ec806e" },
  { name: "piggy_bank", label: "piggy bank", count: 12, color: "#ec8372" },
  { name: "tambourine", label: "tambourine", count: 12, color: "#ed8675" },
  { name: "magnetic_blocks", label: "magnetic blocks", count: 4, color: "#ed8979" },
  { name: "train_tracks", label: "train tracks", count: 2, color: "#ee8c7c" },
  { name: "bubble_wrap", label: "bubble wrap", count: 80, color: "#0ac291" },
  { name: "aluminum_foil", label: "aluminum foil", count: 72, color: "#0fc393" },
  { name: "plastic_wrap", label: "plastic wrap", count: 62, color: "#13c495" },
  { name: "adhesive_wrap", label: "adhesive wrap", count: 50, color: "#17c597" },
  { name: "tape", label: "tape", count: 50, color: "#1bc699" },
  { name: "cling_film", label: "cling film", count: 36, color: "#20c79b" },
  { name: "glue", label: "glue", count: 30, color: "#24c89d" },
  { name: "cellophane", label: "cellophane", count: 29, color: "#28c99f" },
  { name: "construction_paper", label: "construction paper", count: 24, color: "#2dcaa1" },
  { name: "wrapping_paper", label: "wrapping paper", count: 23, color: "#31cca3" },
  { name: "duck_tape", label: "duck tape", count: 21, color: "#35cda5" },
  { name: "parchment_paper", label: "parchment paper", count: 20, color: "#3acea7" },
  { name: "foil", label: "foil", count: 11, color: "#3ecfa8" },
  { name: "masking_tape", label: "masking tape", count: 10, color: "#42d0aa" },
  { name: "origami_paper", label: "origami paper", count: 5, color: "#47d1ac" },
  { name: "crepe_paper", label: "crepe paper", count: 2, color: "#4bd2ae" },
  { name: "glue_bottle", label: "glue bottle", count: 2, color: "#4fd3b0" },
  { name: "window_cling", label: "window cling", count: 2, color: "#54d4b2" },
  { name: "airpods", label: "airpods", count: 82, color: "#ab6bf2" },
  { name: "button", label: "button", count: 64, color: "#ac6cf3" },
  { name: "flip_phone", label: "flip phone", count: 58, color: "#ad6ef3" },
  { name: "camera", label: "camera", count: 42, color: "#ae6ff3" },
  { name: "ethernet_cable", label: "ethernet cable", count: 41, color: "#af71f3" },
  { name: "switch_on_off", label: "switch on off", count: 39, color: "#b073f3" },
  { name: "keyboard", label: "keyboard", count: 35, color: "#b174f3" },
  { name: "calculator", label: "calculator", count: 32, color: "#b276f3" },
  { name: "phone", label: "phone", count: 31, color: "#b377f4" },
  { name: "file_adapter", label: "file adapter", count: 24, color: "#b379f4" },
  { name: "router", label: "router", count: 22, color: "#b47af4" },
  { name: "timer", label: "timer", count: 20, color: "#b57cf4" },
  { name: "usb_cable", label: "usb cable", count: 20, color: "#b67ef4" },
  { name: "joystick", label: "joystick", count: 19, color: "#b77ff4" },
  { name: "laptop", label: "laptop", count: 15, color: "#b881f4" },
  { name: "tv_remote", label: "tv remote", count: 13, color: "#b982f4" },
  { name: "cable", label: "cable", count: 12, color: "#ba84f5" },
  { name: "mouse", label: "mouse", count: 12, color: "#bb86f5" },
  { name: "speaker", label: "speaker", count: 11, color: "#bb87f5" },
  { name: "calculator_key", label: "calculator key", count: 10, color: "#bc89f5" },
  { name: "screen_protector", label: "screen protector", count: 10, color: "#bd8af5" },
  { name: "side_button", label: "side button", count: 8, color: "#be8cf5" },
  { name: "stopwatch", label: "stopwatch", count: 8, color: "#bf8ef5" },
  { name: "power_adapter", label: "power adapter", count: 5, color: "#c08ff6" },
  { name: "charging_cable", label: "charging cable", count: 4, color: "#c191f6" },
  { name: "plug", label: "plug", count: 4, color: "#c292f6" },
  { name: "battery", label: "battery", count: 2, color: "#c394f6" },
  { name: "flashlight", label: "flashlight", count: 2, color: "#c495f6" },
  { name: "on_off_switch", label: "on off switch", count: 2, color: "#c497f6" },
  { name: "measuring_cup", label: "measuring cup", count: 43, color: "#f7a262" },
  { name: "almond", label: "almond", count: 30, color: "#f7a465" },
  { name: "condiment", label: "condiment", count: 30, color: "#f7a567" },
  { name: "sugar", label: "sugar", count: 30, color: "#f7a76a" },
  { name: "pipette", label: "pipette", count: 26, color: "#f7a86c" },
  { name: "coffee_filter", label: "coffee filter", count: 20, color: "#f7a96f" },
  { name: "knife", label: "knife", count: 20, color: "#f8ab71" },
  { name: "spoon", label: "spoon", count: 20, color: "#f8ac74" },
  { name: "fork", label: "fork", count: 19, color: "#f8ae76" },
  { name: "sandwich_press", label: "sandwich press", count: 16, color: "#f8af79" },
  { name: "beaker", label: "beaker", count: 14, color: "#f8b17b" },
  { name: "glass_cup", label: "glass cup", count: 12, color: "#f8b27d" },
  { name: "tweezers", label: "tweezers", count: 7, color: "#f8b480" },
  { name: "dish", label: "dish", count: 5, color: "#f8b582" },
  { name: "kettle", label: "kettle", count: 3, color: "#f9b785" },
  { name: "oil_cruet", label: "oil cruet", count: 2, color: "#f9b887" },
  { name: "pitcher", label: "pitcher", count: 2, color: "#f9ba8a" },
  { name: "tea", label: "tea", count: 2, color: "#f9bb8c" },
  { name: "test_tube", label: "test tube", count: 2, color: "#f9bd8f" },
  { name: "watering_can", label: "watering can", count: 2, color: "#f9be91" },
  { name: "air_blower", label: "air blower", count: 48, color: "#24cbe8" },
  { name: "key", label: "key", count: 31, color: "#29cce9" },
  { name: "screw", label: "screw", count: 30, color: "#2dcee9" },
  { name: "screwdriver", label: "screwdriver", count: 30, color: "#32cfea" },
  { name: "scissors", label: "scissors", count: 29, color: "#37d0ea" },
  { name: "toolbox", label: "toolbox", count: 20, color: "#3bd1eb" },
  { name: "matches", label: "matches", count: 15, color: "#40d2eb" },
  { name: "box_of_matches", label: "box of matches", count: 12, color: "#45d3ec" },
  { name: "table", label: "table", count: 12, color: "#49d4ec" },
  { name: "combination_lock", label: "combination lock", count: 10, color: "#4ed5ed" },
  { name: "zip_tie", label: "zip tie", count: 10, color: "#53d6ed" },
  { name: "foldable_board", label: "foldable board", count: 4, color: "#58d7ed" },
  { name: "pipe", label: "pipe", count: 4, color: "#5cd9ee" },
  { name: "keycard", label: "keycard", count: 2, color: "#61daee" },
  { name: "pvc_pipes", label: "pvc pipes", count: 2, color: "#66dbef" },
  { name: "clamshell_container", label: "clamshell container", count: 62, color: "#f76e95" },
  { name: "dispenser_bottle", label: "dispenser bottle", count: 61, color: "#f76f97" },
  { name: "bowl", label: "bowl", count: 53, color: "#f87198" },
  { name: "bottle_cap", label: "bottle cap", count: 52, color: "#f87399" },
  { name: "drawer", label: "drawer", count: 52, color: "#f8759a" },
  { name: "bottle", label: "bottle", count: 41, color: "#f8769c" },
  { name: "cup", label: "cup", count: 37, color: "#f8789d" },
  { name: "jar_lid", label: "jar lid", count: 34, color: "#f87a9e" },
  { name: "jewelry_box", label: "jewelry box", count: 34, color: "#f87c9f" },
  { name: "glasses_case", label: "glasses case", count: 33, color: "#f87da1" },
  { name: "carafe", label: "carafe", count: 32, color: "#f87fa2" },
  { name: "package", label: "package", count: 30, color: "#f881a3" },
  { name: "pen_bag", label: "pen bag", count: 30, color: "#f883a4" },
  { name: "pencil_case", label: "pencil case", count: 24, color: "#f984a6" },
  { name: "bucket", label: "bucket", count: 23, color: "#f986a7" },
  { name: "paper_plate", label: "paper plate", count: 20, color: "#f988a8" },
  { name: "plate", label: "plate", count: 13, color: "#f98aaa" },
  { name: "plastic_plate", label: "plastic plate", count: 12, color: "#f98bab" },
  { name: "paper_bag", label: "paper bag", count: 10, color: "#f98dac" },
  { name: "water_bottle", label: "water bottle", count: 10, color: "#f98fad" },
  { name: "lunch_bag", label: "lunch bag", count: 8, color: "#f991af" },
  { name: "egg_carton", label: "egg carton", count: 4, color: "#f992b0" },
  { name: "hinged_tin", label: "hinged tin", count: 4, color: "#f994b1" },
  { name: "spray_bottle", label: "spray bottle", count: 4, color: "#f996b2" },
  { name: "mustard_cap", label: "mustard cap", count: 2, color: "#fa98b4" },
  { name: "carafe_lid", label: "carafe lid", count: 1, color: "#fa99b5" },
  { name: "sponge", label: "sponge", count: 62, color: "#b6e385" },
  { name: "napkin", label: "napkin", count: 54, color: "#b7e387" },
  { name: "scarf", label: "scarf", count: 52, color: "#b8e488" },
  { name: "tissue", label: "tissue", count: 50, color: "#b9e48a" },
  { name: "ribbon", label: "ribbon", count: 48, color: "#bae48c" },
  { name: "cloth", label: "cloth", count: 41, color: "#bbe58d" },
  { name: "string", label: "string", count: 41, color: "#bce58f" },
  { name: "muslin", label: "muslin", count: 34, color: "#bce590" },
  { name: "velcro_strap", label: "velcro strap", count: 33, color: "#bde692" },
  { name: "bandana", label: "bandana", count: 32, color: "#bee693" },
  { name: "paper_towel", label: "paper towel", count: 32, color: "#bfe695" },
  { name: "cheesecloth", label: "cheesecloth", count: 30, color: "#c0e797" },
  { name: "memory_foam", label: "memory foam", count: 29, color: "#c1e798" },
  { name: "towel", label: "towel", count: 29, color: "#c2e89a" },
  { name: "arm_wrap", label: "arm wrap", count: 23, color: "#c3e89b" },
  { name: "netting", label: "netting", count: 22, color: "#c4e89d" },
  { name: "sash", label: "sash", count: 22, color: "#c5e99f" },
  { name: "gel_pad", label: "gel pad", count: 20, color: "#c6e9a0" },
  { name: "thread", label: "thread", count: 20, color: "#c7e9a2" },
  { name: "felt_sheet", label: "felt sheet", count: 15, color: "#c8eaa3" },
  { name: "handkerchief", label: "handkerchief", count: 12, color: "#c9eaa5" },
  { name: "yarn", label: "yarn", count: 10, color: "#caeba7" },
  { name: "straw", label: "straw", count: 5, color: "#cbeba8" },
  { name: "tissue_paper", label: "tissue paper", count: 2, color: "#ccebaa" },
  { name: "book", label: "book", count: 82, color: "#fa9cfa" },
  { name: "whiteboard", label: "whiteboard", count: 61, color: "#fa9dfa" },
  { name: "coin", label: "coin", count: 60, color: "#fa9efa" },
  { name: "paper", label: "paper", count: 51, color: "#fa9ffa" },
  { name: "bumper_sticker", label: "bumper sticker", count: 42, color: "#faa1fa" },
  { name: "stapler", label: "stapler", count: 41, color: "#faa2fa" },
  { name: "map", label: "map", count: 39, color: "#faa3fa" },
  { name: "sticky_note", label: "sticky note", count: 38, color: "#faa4fa" },
  { name: "card", label: "card", count: 30, color: "#faa5fa" },
  { name: "marker", label: "marker", count: 30, color: "#faa6fa" },
  { name: "pen", label: "pen", count: 30, color: "#faa7fa" },
  { name: "receipt_paper", label: "receipt paper", count: 30, color: "#faa8fa" },
  { name: "sticker", label: "sticker", count: 29, color: "#faa9fa" },
  { name: "photo_album", label: "photo album", count: 24, color: "#fbaafb" },
  { name: "dollar_bill", label: "dollar bill", count: 22, color: "#fbacfb" },
  { name: "shipping_label", label: "shipping label", count: 22, color: "#fbadfb" },
  { name: "file", label: "file", count: 20, color: "#fbaefb" },
  { name: "paper_clamp", label: "paper clamp", count: 12, color: "#fbaffb" },
  { name: "envelope_seal", label: "envelope seal", count: 10, color: "#fbb0fb" },
  { name: "postage_stamp", label: "postage stamp", count: 10, color: "#fbb1fb" },
  { name: "folder", label: "folder", count: 4, color: "#fbb2fb" },
  { name: "paper_clip", label: "paper clip", count: 4, color: "#fbb3fb" },
  { name: "pen_and_cap", label: "pen and cap", count: 4, color: "#fbb4fb" },
  { name: "textbook", label: "textbook", count: 4, color: "#fbb5fb" },
  { name: "canvas_paper", label: "canvas paper", count: 2, color: "#fbb7fb" },
  { name: "envelope", label: "envelope", count: 2, color: "#fbb8fb" },
  { name: "penn_cap", label: "penn cap", count: 1, color: "#fbb9fb" },
  { name: "receipt", label: "receipt", count: 1, color: "#fbbafb" },
  { name: "backpack", label: "backpack", count: 71, color: "#f5c85b" },
  { name: "shorts", label: "shorts", count: 68, color: "#f6c95f" },
  { name: "glasses", label: "glasses", count: 44, color: "#f6cb64" },
  { name: "hoodie", label: "hoodie", count: 32, color: "#f6cc68" },
  { name: "shirt", label: "shirt", count: 30, color: "#f6ce6d" },
  { name: "jacket", label: "jacket", count: 29, color: "#f7cf71" },
  { name: "long_pants", label: "long pants", count: 28, color: "#f7d176" },
  { name: "coat", label: "coat", count: 21, color: "#f7d27a" },
  { name: "belt", label: "belt", count: 20, color: "#f7d47e" },
  { name: "shoe", label: "shoe", count: 20, color: "#f8d583" },
  { name: "hair_clip", label: "hair clip", count: 18, color: "#f8d787" },
  { name: "apron", label: "apron", count: 12, color: "#f8d88c" },
];
export type ObjCatSpan = { cat: string; start: number; end: number; color: string };
export const OBJECT_CAT_SPANS: ObjCatSpan[] = [
  { cat: "Personal Care", start: 0, end: 20, color: "#6b74f2" },
  { cat: "Toys", start: 21, end: 37, color: "#e65b44" },
  { cat: "Wrapping & Tape", start: 38, end: 55, color: "#0ac291" },
  { cat: "Electronics", start: 56, end: 84, color: "#ab6bf2" },
  { cat: "Kitchen", start: 85, end: 104, color: "#f7a262" },
  { cat: "Hardware & Tools", start: 105, end: 119, color: "#24cbe8" },
  { cat: "Containers", start: 120, end: 145, color: "#f76e95" },
  { cat: "Fabric & Cloth", start: 146, end: 169, color: "#b6e385" },
  { cat: "Paper & Writing", start: 170, end: 197, color: "#fa9cfa" },
  { cat: "Clothing", start: 198, end: 209, color: "#f5c85b" },
];
