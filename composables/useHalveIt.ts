import { useLocalStorage } from "@vueuse/core";

export type HalveItState = {
  id: string;
  createdAt: number;
  players: string[];
  throws: DartThrowRecord[][];
  version: number; // Versioning for future updates
};

// prettier-ignore
const ROUND_LABELS = ["Numéro 15", "Numéro 16", "N'importe quel double", "Numéro 17", "Numéro 18", "N'importe quel triple", "Numéro 19", "Numéro 20", "Le bull"] as const;
const ROUND_TARGETS: DartThrowId[][] = [
  ["S15", "D15", "T15"],
  ["S16", "D16", "T16"],
  // prettier-ignore
  ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "DB"],
  ["S17", "D17", "T17"],
  ["S18", "D18", "T18"],
  // prettier-ignore
  ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12", "T13", "T14", "T15", "T16", "T17", "T18", "T19", "T20"],
  ["S19", "D19", "T19"],
  ["S20", "D20", "T20"],
  ["SB", "DB"],
];

/** Create a new Halve It game and navigate to it */
export function createNewHalveIt(players: string[]) {
  const gameId = `halve-it-${Date.now()}`;
  useLocalStorage<HalveItState>(gameId, {
    id: gameId,
    createdAt: Date.now(),
    players,
    throws: [[]],
    version: 2,
  });
  navigateTo(`/halve-it/${gameId}`);
}

/**
 * Return the logic of a Halve It game.
 */
export function useHalveIt(gameId: string) {
  const gameState = useLocalStorage(gameId, {} as HalveItState, { deep: true });
  // If the game state is empty, it means the game does not exist
  if (Object.keys(gameState.value).length === 0) {
    gameState.value = null; // Remove the game state from localStorage
    throw new Error("Game data not found. Please start a new game.");
  }

  /** Current turn of the game (starts at 0) */
  const turn = computed(() => gameState.value.throws.length - 1);

  /** Current round of the game (starts at 1) */
  const round = computed(() => {
    return Math.floor(turn.value / gameState.value.players.length) + 1;
  });
  /** Current round label */
  const roundLabel = computed(() => ROUND_LABELS[round.value - 1]);
  /** Current round targets IDs */
  const roundTargets = computed(() => ROUND_TARGETS[round.value - 1]);

  /** Players with their scores computed */
  const players = computed(() => {
    const playerScores = gameState.value.players.map((name) => ({
      name,
      score: 0,
    }));

    for (let i = 0; i <= turn.value; i++) {
      const roundIndex = Math.floor(i / gameState.value.players.length);
      const turnScore = gameState.value.throws[i]
        .filter((t) => ROUND_TARGETS[roundIndex].includes(t.dartThrow.id))
        .reduce((sum, record) => sum + record.dartThrow.score, 0);
      const playerIndex = i % gameState.value.players.length;

      // If the player scored, add the score, otherwise halve it
      if (turnScore > 0) {
        playerScores[playerIndex].score += turnScore;
      } else if (i < turn.value) {
        // Don't halve if it's the current turn
        playerScores[playerIndex].score = Math.ceil(
          playerScores[playerIndex].score / 2
        );
      }
    }

    return playerScores;
  });

  /** Current player index */
  const currentPlayer = computed(() => {
    return turn.value % gameState.value.players.length;
  });

  /** Current player's throws */
  const currentThrows = computed<DartThrowRecord[]>(() => {
    return gameState.value.throws[turn.value];
  });

  /** Players sorted by score */
  const ranking = computed(() =>
    players.value.toSorted((p1, p2) => p2.score - p1.score)
  );

  /** Current winner if the game is over */
  const winner = computed(() => {
    if (round.value > ROUND_TARGETS.length) {
      return ranking.value[0];
    }
    return null;
  });

  /**

  /** If the current player's turn is ended */
  const waitingForConfirmation = computed(() => {
    return currentThrows.value.length === 3;
  });

  /** Record a dart throw with its coordinates */
  function recordThrow(dartThrow: DartThrow, coordinates: ThrowCoordinates) {
    if (waitingForConfirmation.value) return;

    // Keep reactivity by creating a new array
    gameState.value.throws[turn.value] = [
      ...gameState.value.throws[turn.value],
      {
        id: turn.value * 3 + gameState.value.throws[turn.value].length,
        dartThrow,
        coordinates,
      },
    ];
  }

  /** Pass to the next turn */
  function confirmThrows() {
    if (winner.value) return;
    gameState.value.throws.push([]);
  }

  /** Undo the last throw or the last turn */
  function undo() {
    if (currentThrows.value.length > 0) {
      // Remove the last throw
      gameState.value.throws[turn.value] = gameState.value.throws[
        turn.value
      ].slice(0, -1);
    } else if (gameState.value.throws.length > 1) {
      // Back to the previous turn
      gameState.value.throws = gameState.value.throws.slice(0, -1);
    }
  }

  const canUndo = computed(() => {
    return currentThrows.value.length > 0 || gameState.value.throws.length > 1;
  });

  /** Start a new game with the same config */
  function revenge() {
    createNewHalveIt(gameState.value.players);
  }

  return {
    state: computed(() => gameState.value), // Read-only state
    players,
    currentPlayer,
    round,
    roundLabel,
    roundTargets,
    ranking,
    currentThrows,
    winner,
    recordThrow,
    waitingForConfirmation,
    confirmThrows,
    canUndo,
    undo,
    revenge,
  };
}
export type HalveItGame = ReturnType<typeof useHalveIt>;
