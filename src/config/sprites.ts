import type { PixelPalette } from "../components/PixelSprite";

// 10 wide x 12 tall pixel hero — Johnny Bravo-style silhouette: blonde
// pompadour, black wraparound shades, black tee, blue jeans. Each character
// is one pixel; "." is transparent.
export const heroMatrix: string[] = [
  "..OCCCCO..",
  ".OCCCCCCO.",
  ".OSSSSSSO.",
  ".OOOOOOOO.",
  "..OSSSSO..",
  "..OJJJJO..",
  ".OJJJJJJO.",
  ".OJJJJJJO.",
  "..OJJJJO..",
  "..OPP.PPO.",
  "..OPP.PPO.",
  "..OBB.BBO.",
];

export const heroPalette: PixelPalette = {
  O: "var(--ink)",
  C: "var(--accent)",
  S: "#f2c49b",
  J: "var(--ink)",
  P: "#3d63b8",
  B: "var(--ink)",
};

// Same hero, mid-stride running pose (frame A) — torso identical to
// heroMatrix, legs scissored into a run cycle.
export const heroRunMatrixA: string[] = [
  "..OCCCCO..",
  ".OCCCCCCO.",
  ".OSSSSSSO.",
  ".OOOOOOOO.",
  "..OSSSSO..",
  "..OJJJJO..",
  ".OJJJJJJOS",
  "SOJJJJJJO.",
  "..OJJJJO..",
  ".OPP...PO.",
  ".OP...PPO.",
  ".OB...BBO.",
];

// Run cycle frame B — mirror of frame A's leg positions.
export const heroRunMatrixB: string[] = [
  "..OCCCCO..",
  ".OCCCCCCO.",
  ".OSSSSSSO.",
  ".OOOOOOOO.",
  "..OSSSSO..",
  "..OJJJJO..",
  "SOJJJJJJO.",
  ".OJJJJJJOS",
  "..OJJJJO..",
  ".OP...PPO.",
  ".OPP...PO.",
  ".OBB...BO.",
];

// 8 wide x 8 tall clay urn obstacle.
export const barrelMatrix: string[] = [
  ".KKKKKK.",
  "KKKKKKKK",
  "KYYYYYYK",
  "KKKKKKKK",
  "KYYYYYYK",
  "KKKKKKKK",
  "KYYYYYYK",
  ".KKKKKK.",
];

export const barrelPalette: PixelPalette = {
  K: "var(--accent-2)",
  Y: "var(--accent)",
};

// 6 wide x 7 tall sandstone spike obstacle.
export const coneMatrix: string[] = [
  "..CC..",
  ".CCCC.",
  ".CCCC.",
  "CCCCCC",
  "CCCCCC",
  ".WWWW.",
  "CCCCCC",
];

export const conePalette: PixelPalette = {
  // Was --hill-mid, a near-black background color in the night theme that
  // made the cone nearly invisible against the dark road. --text-dim reads
  // as sandstone in both themes without disappearing at night.
  C: "var(--text-dim)",
  W: "var(--accent)",
};

// 8 wide x 7 tall wooden supply crate.
export const crateMatrix: string[] = [
  "KKKKKKKK",
  "KWKKKKWK",
  "KKWKKWKK",
  "KKKWWKKK",
  "KKWKKWKK",
  "KWKKKKWK",
  "KKKKKKKK",
];

export const cratePalette: PixelPalette = {
  // Was K: --panel (the crate's majority fill) which is near-black at
  // night, making it blend into the road. Swapped roles so the lighter
  // tone covers the body and --panel is just the minority grain lines.
  K: "var(--text-dim)",
  W: "var(--panel)",
};

// 7 wide x 5 tall spiked caltrop — the one obstacle that borrows the
// reserved "danger" accent, since obstacles are the thing that costs a life.
export const caltropMatrix: string[] = [
  "..C.C..",
  ".CCCCC.",
  "CCCCCCC",
  ".CCCCC.",
  "..C.C..",
];

export const caltropPalette: PixelPalette = {
  C: "var(--accent-4)",
};
