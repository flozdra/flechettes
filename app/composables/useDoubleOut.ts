import { useLocalStorage } from "@vueuse/core";

export type DoubleOutState = {
  id: string;
  createdAt: number;
  initialScore: 301 | 501;
  endWithDouble: boolean;
  players: string[];
  throws: DartThrowRecord[][];
  version: number; // Versioning for future updates
};

/** Create a new Double Out game and navigate to it */
export function createNewDoubleOut(
  initialScore: 301 | 501,
  endWithDouble: boolean,
  players: string[],
) {
  const gameId = `double-out-${Date.now()}`;
  useLocalStorage<DoubleOutState>(gameId, {
    id: gameId,
    createdAt: Date.now(),
    initialScore,
    endWithDouble,
    players,
    throws: [[]],
    version: 2,
  });
  navigateTo(`/double-out/${gameId}`);
}

/** Compute the total score for a turn */
function getTurnScore(records: DartThrowRecord[]) {
  return records.reduce((sum, record) => sum + record.dartThrow.score, 0);
}

/**
 * Return the logic of a Double Out game.
 */
export function useDoubleOut(gameId: string) {
  const gameState = useLocalStorage(gameId, {} as DoubleOutState, {
    deep: true,
  });
  // If the game state is empty, it means the game does not exist
  if (Object.keys(gameState.value).length === 0) {
    gameState.value = null; // Remove the game state from localStorage
    throw new Error("Game data not found. Please start a new game.");
  }
  // Convert from version 1 to version 2 if needed
  if (gameState.value.version === 1) {
    gameState.value = convertDoubleOutFromV1ToV2(
      gameState.value as unknown as DoubleOutStateV1,
    );
  }

  /** Current turn of the game (starts at 0) */
  const turn = computed(() => gameState.value.throws.length - 1);

  /** Current round of the game (starts at 1) */
  const round = computed(() => {
    return Math.floor(turn.value / gameState.value.players.length) + 1;
  });

  /** Players with their scores computed */
  const players = computed(() => {
    const playerScores = gameState.value.players.map((name) => ({
      name,
      invalid: false,
      score: gameState.value.initialScore as number,
    }));

    for (let i = 0; i <= turn.value; i++) {
      const turnScore = getTurnScore(gameState.value.throws[i]);
      const lastThrow = gameState.value.throws[i].slice(-1)[0];
      const playerIndex = i % gameState.value.players.length;
      const remainingScore = playerScores[playerIndex].score - turnScore;

      if (gameState.value.endWithDouble) {
        const isLastThrowValid = lastThrow?.dartThrow.id.startsWith("D");
        // Valid turn
        if (remainingScore > 1) {
          playerScores[playerIndex].score = remainingScore;
        } // Player won
        else if (remainingScore === 0 && isLastThrowValid) {
          playerScores[playerIndex].score = 0;
        } // Set invalid scores only for last turn
        else if (i === turn.value) {
          playerScores[playerIndex].invalid = true;
          playerScores[playerIndex].score = remainingScore; // Overflow or cannot halve
        }
      } else {
        if (remainingScore > 0) {
          playerScores[playerIndex].score = remainingScore;
        } // Player won
        else if (remainingScore === 0) {
          playerScores[playerIndex].score = 0;
        } // Set invalid scores only for last turn
        else if (i === turn.value) {
          playerScores[playerIndex].invalid = true;
          playerScores[playerIndex].score = remainingScore; // Overflow or cannot halve
        }
      }
    }

    return playerScores;
  });

  /** If the current player's turn is invalid */
  const invalidTurn = computed(() => {
    return players.value[currentPlayer.value].invalid;
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
    players.value.toSorted((p1, p2) => p1.score - p2.score),
  );

  /** Current winner if exists */
  const winner = computed(() => {
    return players.value.find((p) => p.score === 0 && !p.invalid) || null;
  });

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

  /** Best winning combination based on the current player's score */
  const winningCombination = computed(() => {
    if (invalidTurn.value) return [];
    const currentPlayerScore = players.value[currentPlayer.value].score;
    return getBestCombination(
      currentPlayerScore,
      currentThrows.value.map((t) => t.dartThrow),
      gameState.value.endWithDouble,
    );
  });

  /** Best winning combination throw IDs */
  const currentPlayerHighlights = computed(() => {
    return winningCombination.value.map((dartThrow) => dartThrow.id);
  });

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
    createNewDoubleOut(
      gameState.value.initialScore,
      gameState.value.endWithDouble,
      gameState.value.players,
    );
  }

  return {
    state: computed(() => gameState.value), // Read-only state
    players,
    currentPlayer,
    round,
    ranking,
    currentThrows,
    invalidTurn,
    winner,
    winningCombination,
    currentPlayerHighlights,
    recordThrow,
    waitingForConfirmation,
    confirmThrows,
    canUndo,
    undo,
    revenge,
  };
}
export type DoubleOutGame = ReturnType<typeof useDoubleOut>;

/*
|--------------------------------------------------------------------------
| Double Out state versioning
|--------------------------------------------------------------------------
*/
type DoubleOutStateV1 = {
  id: string;
  createdAt: number;
  score: 301 | 501;
  players: { name: string; score: number; throws: DartThrowRecord[][] }[];
  round: number;
  currentPlayerIndex: number;
  winnerIndex: number | null;
  version: 1;
};

/**
 * Convert a Double Out game from version 1 to version 2.
 */
export function convertDoubleOutFromV1ToV2(
  game: DoubleOutStateV1,
): DoubleOutState {
  const throws: DartThrowRecord[][] = [];
  for (let i = 0; i < game.round; i++) {
    for (const player of game.players) {
      if (player.throws[i]) {
        throws.push(player.throws[i]);
      }
    }
  }
  return {
    id: game.id,
    createdAt: game.createdAt,
    initialScore: game.score,
    endWithDouble: false,
    players: game.players.map(({ name }) => name),
    throws,
    version: 2,
  };
}
