// prettier-ignore
type Numbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
type DartThrowId =
  | "OUT"
  | `S${Numbers}`
  | `D${Numbers}`
  | `T${Numbers}`
  | "SB"
  | "DB";

export type Coordinates = { x: number; y: number };
export enum Colors {
  Beige = "#FAE0B7",
  Black = "#121415",
  Gray = "#A6AFB5",
  Green = "#15951F",
  Red = "#FD201D",
}
export type DartThrow = {
  id: DartThrowId;
  color: Colors;
  score: number;
  label: string;
};

const blackOrRedNumbers = new Set<Numbers>([
  20, 18, 13, 10, 2, 3, 7, 8, 14, 12,
]);

export const DartThrows: Record<DartThrowId, DartThrow> = {
  OUT: { id: "OUT", color: Colors.Black, score: 0, label: "OUT" },
  ...Array.from({ length: 20 }, (_, i) => i + 1).reduce((acc, score) => {
    const simpleId: DartThrowId = `S${score as Numbers}`;
    const doubleId: DartThrowId = `D${score as Numbers}`;
    const tripleId: DartThrowId = `T${score as Numbers}`;
    const isBlackOrRed = blackOrRedNumbers.has(score as Numbers);
    acc[simpleId] = {
      id: simpleId,
      color: isBlackOrRed ? Colors.Black : Colors.Beige,
      score,
      label: String(score),
    };
    acc[doubleId] = {
      id: doubleId,
      color: isBlackOrRed ? Colors.Red : Colors.Green,
      score: score * 2,
      label: `${score} × 2`,
    };
    acc[tripleId] = {
      id: tripleId,
      color: isBlackOrRed ? Colors.Red : Colors.Green,
      score: score * 3,
      label: `${score} × 3`,
    };
    return acc;
  }, {} as Record<Exclude<DartThrowId, "OUT" | "SB" | "DB">, DartThrow>),
  SB: {
    id: "SB",
    color: Colors.Green,
    score: 25,
    label: "Bull",
  },
  DB: {
    id: "DB",
    color: Colors.Red,
    score: 50,
    label: "Bull × 2",
  },
};

export interface DartThrowRecord {
  id: number;
  dartThrow: DartThrow;
  coordinates: Coordinates;
}
