export type Combination = { total: number; throws: DartThrow[] };

/**
 * Predictions for the upcoming throws.
 * It is used when a player can win the game within the next turn.
 */
const allThrows = Object.values(DartThrows).filter(({ id }) => id !== "OUT");
const doubleThrows = allThrows.filter(({ id }) => id.startsWith("D"));

/** Possible combinations to end the game with one dart */
const oneDartCombinations = doubleThrows.map((t) => ({
  total: t.score,
  throws: [t],
}));

/** Possible combinations to end the game with two darts */
const twoDartsCombinations: Combination[] = [...oneDartCombinations];
for (let i = allThrows.length - 1; i >= 0; i--) {
  for (let j = doubleThrows.length - 1; j >= 0; j--) {
    const throws = [allThrows[i], doubleThrows[j]];
    const total = throws[0].score + throws[1].score;
    twoDartsCombinations.push({ total, throws });
  }
}

/** Possible combinations to end the game with three darts */
const threeDartsCombinations: Combination[] = [...twoDartsCombinations];
for (let i = allThrows.length - 1; i >= 0; i--) {
  for (let j = allThrows.length - 1; j >= 0; j--) {
    for (let k = doubleThrows.length - 1; k >= 0; k--) {
      const throws = [allThrows[i], allThrows[j], doubleThrows[k]];
      const total = throws[0].score + throws[1].score + throws[2].score;
      threeDartsCombinations.push({ total, throws });
    }
  }
}

export {
  allThrows,
  doubleThrows,
  oneDartCombinations,
  twoDartsCombinations,
  threeDartsCombinations,
};
