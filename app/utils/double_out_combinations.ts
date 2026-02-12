export type Combination = { total: number; throws: DartThrow[] };

const allThrows = Object.values(DartThrows).filter(({ id }) => id !== "OUT");

/** Possible combinations to end the game with 1 dart */
const oneDartCombinations: Combination[] = [];
/** Possible combinations to end the game with 1 or 2 darts */
const twoDartsCombinations: Combination[] = [];
/** Possible combinations to end the game with 1, 2, or 3 darts */
const threeDartsCombinations: Combination[] = [];

/** Compute all possible combinations */
for (let i = allThrows.length - 1; i >= 0; i--) {
  const oneDartCombination: Combination = {
    total: allThrows[i].score,
    throws: [allThrows[i]],
  };
  oneDartCombinations.push(oneDartCombination);
  twoDartsCombinations.push(oneDartCombination);
  threeDartsCombinations.push(oneDartCombination);

  for (let j = allThrows.length - 1; j >= 0; j--) {
    const twoDartsCombination: Combination = {
      total: allThrows[i].score + allThrows[j].score,
      throws: [allThrows[i], allThrows[j]],
    };
    twoDartsCombinations.push(twoDartsCombination);
    threeDartsCombinations.push(twoDartsCombination);

    for (let k = allThrows.length - 1; k >= 0; k--) {
      const threeDartsCombination: Combination = {
        total: allThrows[i].score + allThrows[j].score + allThrows[k].score,
        throws: [allThrows[i], allThrows[j], allThrows[k]],
      };
      threeDartsCombinations.push(threeDartsCombination);
    }
  }
}

export function getBestCombination(
  remainingScore: number,
  currentThrows: DartThrow[],
  endWithDouble: boolean
) {
  const possibleCombinations =
    currentThrows.length === 0
      ? threeDartsCombinations
      : currentThrows.length === 1
      ? twoDartsCombinations
      : currentThrows.length === 2
      ? oneDartCombinations
      : [];

  // Find the winning combinations
  const winningCombinations = possibleCombinations.filter(
    (c) =>
      c.total === remainingScore &&
      (!endWithDouble || c.throws[c.throws.length - 1].id.startsWith("D"))
  );

  if (endWithDouble) {
    // Sort to get shorted combination with the lowest score first
    winningCombinations.sort(
      (a, b) =>
        a.throws.length - b.throws.length ||
        b.throws[2]?.score - a.throws[2]?.score ||
        b.throws[1]?.score - a.throws[1]?.score ||
        b.throws[0]?.score - a.throws[0]?.score
    );
  } else {
    // Sort to get shorted combination with the highest score first
    winningCombinations.sort(
      (a, b) =>
        a.throws.length - b.throws.length ||
        a.throws[0]?.score - b.throws[0]?.score ||
        a.throws[1]?.score - b.throws[1]?.score ||
        a.throws[2]?.score - b.throws[2]?.score
    );
  }

  return winningCombinations[0]?.throws ?? [];
}
