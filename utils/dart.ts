// prettier-ignore
type DartNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
type DartThrowId =
  | "OUT"
  | `S${DartNumbers}`
  | `D${DartNumbers}`
  | `T${DartNumbers}`
  | "SB"
  | "DB";

export type ThrowCoordinates = { x: number; y: number };
export enum DartColors {
  Beige = "#FAE0B7",
  Black = "#121415",
  Gray = "#A6AFB5",
  Green = "#15951F",
  Red = "#FD201D",
}
export type DartThrow = {
  id: DartThrowId;
  color: DartColors;
  score: number;
  label: string;
};

const blackOrRedNumbers = new Set<DartNumbers>([
  20, 18, 13, 10, 2, 3, 7, 8, 14, 12,
]);

export const DartThrows: Record<DartThrowId, DartThrow> = {
  OUT: { id: "OUT", color: DartColors.Black, score: 0, label: "OUT" },
  ...Array.from({ length: 20 }, (_, i) => i + 1).reduce((acc, score) => {
    const simpleId: DartThrowId = `S${score as DartNumbers}`;
    const doubleId: DartThrowId = `D${score as DartNumbers}`;
    const tripleId: DartThrowId = `T${score as DartNumbers}`;
    const isBlackOrRed = blackOrRedNumbers.has(score as DartNumbers);
    acc[simpleId] = {
      id: simpleId,
      color: isBlackOrRed ? DartColors.Black : DartColors.Beige,
      score,
      label: String(score),
    };
    acc[doubleId] = {
      id: doubleId,
      color: isBlackOrRed ? DartColors.Red : DartColors.Green,
      score: score * 2,
      label: `${score} × 2`,
    };
    acc[tripleId] = {
      id: tripleId,
      color: isBlackOrRed ? DartColors.Red : DartColors.Green,
      score: score * 3,
      label: `${score} × 3`,
    };
    return acc;
  }, {} as Record<Exclude<DartThrowId, "OUT" | "SB" | "DB">, DartThrow>),
  SB: {
    id: "SB",
    color: DartColors.Green,
    score: 25,
    label: "Bull",
  },
  DB: {
    id: "DB",
    color: DartColors.Red,
    score: 50,
    label: "Bull × 2",
  },
};

export interface DartThrowRecord {
  id: number;
  dartThrow: DartThrow;
  coordinates: ThrowCoordinates;
}
