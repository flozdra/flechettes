/**
 * Z-score for a given confidence level (approximation for common values)
 */
const zScores = {
  0.8: 1.282,
  0.85: 1.44,
  0.9: 1.645,
  0.95: 1.96,
  0.99: 2.576,
} as const;

type Z = keyof typeof zScores;

/**
 * Wilson confidence interval (lower bound)
 *
 * @param wins - Number of wins
 * @param games - Total number of games
 * @param confidence - Confidence level (default 0.95)
 * @returns Wilson score (lower bound)
 */
export function wilsonScore(wins: number, games: number, confidence: Z = 0.95) {
  if (games === 0) return 0;

  const p = wins / games;
  const z = zScores[confidence];

  const numerator =
    p +
    (z * z) / (2 * games) -
    z * Math.sqrt((p * (1 - p)) / games + (z * z) / (4 * games * games));

  const denominator = 1 + (z * z) / games;

  return numerator / denominator;
}
