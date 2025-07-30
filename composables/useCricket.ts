import { useLocalStorage } from "@vueuse/core";

// prettier-ignore
const CricketNumbersList = ["15", "16", "17", "18", "19", "20", "bull"] as const;
type CricketNumbers = (typeof CricketNumbersList)[number];
export type CricketTable = Record<CricketNumbers, number>;

export type CricketGame = {
  id: string;
  createdAt: number;
  players: { name: string; table: CricketTable; throws: DartThrowRecord[][] }[];
  round: number;
  currentPlayerIndex: number;
  winnerIndex: number | null;
  version: number; // Versioning for future updates
};

export function createNewCricket(playerName: string[]) {
  const gameId = `cricket-${Date.now()}`;
  useLocalStorage<CricketGame>(gameId, {
    id: gameId,
    createdAt: Date.now(),
    players: playerName.map((name) => ({
      name,
      table: { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, bull: 0 },
      throws: [],
    })),
    round: 1,
    currentPlayerIndex: 0,
    winnerIndex: null,
    version: 1,
  });
  return gameId;
}

function isTableComplete(table: CricketTable) {
  return CricketNumbersList.every((numberKey) => table[numberKey] >= 3);
}

/**
 * Merge the scores in table with the throws.
 * @param revert If true, it will revert the score table by subtracting the throws.
 * @returns A copy of the table with the scores updated based on the throws.
 */
function mergeTableWithThrows(
  sourceTable: CricketTable,
  throws: DartThrowRecord[],
  revert = false
) {
  const table = Object.assign({}, sourceTable);
  const multiplier = revert ? -1 : 1;
  for (const throwRecord of throws) {
    switch (throwRecord.dartThrow.id) {
      case DartThrows.S15.id:
      case DartThrows.D15.id:
      case DartThrows.T15.id:
        table["15"] += multiplier * (throwRecord.dartThrow.score / 15);
        break;
      case DartThrows.S16.id:
      case DartThrows.D16.id:
      case DartThrows.T16.id:
        table["16"] += multiplier * (throwRecord.dartThrow.score / 16);
        break;
      case DartThrows.S17.id:
      case DartThrows.D17.id:
      case DartThrows.T17.id:
        table["17"] += multiplier * (throwRecord.dartThrow.score / 17);
        break;
      case DartThrows.S18.id:
      case DartThrows.D18.id:
      case DartThrows.T18.id:
        table["18"] += multiplier * (throwRecord.dartThrow.score / 18);
        break;
      case DartThrows.S19.id:
      case DartThrows.D19.id:
      case DartThrows.T19.id:
        table["19"] += multiplier * (throwRecord.dartThrow.score / 19);
        break;
      case DartThrows.S20.id:
      case DartThrows.D20.id:
      case DartThrows.T20.id:
        table["20"] += multiplier * (throwRecord.dartThrow.score / 20);
        break;
      case DartThrows.SB.id:
      case DartThrows.DB.id:
        table.bull += multiplier * (throwRecord.dartThrow.score / 25);
        break;
    }
  }
  return table;
}

/**
 * Return the logic of a Cricket game.
 */
export function useCricket(gameId: string) {
  const settings = useSettings();
  const soundEffects = useSoundEffects();

  const gameState = useLocalStorage<CricketGame>(gameId, {} as CricketGame, {
    deep: true,
  });
  if (Object.keys(gameState.value).length === 0) {
    gameState.value = null; // Remove the game state from localStorage
    throw new Error("Game data not found. Please start a new game.");
  }

  const currentThrows = ref<DartThrowRecord[]>([]);

  /**
   * Merge the current player's table with the current throws
   */
  const currentPlayerFutureTable = computed(() => {
    const currentPlayerTable =
      gameState.value.players[gameState.value.currentPlayerIndex].table;
    return mergeTableWithThrows(currentPlayerTable, currentThrows.value);
  });

  /**
   * Current player remaining throws.
   */
  const currentPlayerHighlights = computed(() => {
    const numbers = CricketNumbersList.filter(
      (key) => currentPlayerFutureTable.value[key] < 3
    );
    return numbers
      .map<DartThrowId[]>((key) => {
        return key === "bull"
          ? ["SB", "DB"]
          : [`S${key}`, `D${key}`, `T${key}`];
      })
      .flat();
  });

  const winner = computed(() =>
    gameState.value.winnerIndex !== null
      ? gameState.value.players[gameState.value.winnerIndex]
      : null
  );

  /**
   * Waiting confirmation when the player has thrown 3 darts or will win
   * with the current throws.
   */
  const waitingForConfirmation = computed(() => {
    return (
      currentThrows.value.length === 3 ||
      isTableComplete(currentPlayerFutureTable.value)
    );
  });

  function recordThrow(
    dartThrow: DartThrow,
    coordinates: { x: number; y: number }
  ) {
    if (waitingForConfirmation.value) return;

    const roundIndex = gameState.value.round - 1;

    currentThrows.value.push({
      id: roundIndex + currentThrows.value.length + 1,
      dartThrow,
      coordinates,
    });

    if (dartThrow.id === "DB") {
      soundEffects.sniper.play();
    } else if (dartThrow.score >= 15) {
      soundEffects.rifle.play();
    }

    if (settings.value.autoConfirmThrows && waitingForConfirmation.value) {
      confirmThrows();
    }
  }

  function confirmThrows() {
    const currentPlayer =
      gameState.value.players[gameState.value.currentPlayerIndex];
    const roundIndex = gameState.value.round - 1;

    currentPlayer.throws[roundIndex] = [...currentThrows.value];
    currentPlayer.table = currentPlayerFutureTable.value;

    if (isTableComplete(currentPlayer.table)) {
      gameState.value.winnerIndex = gameState.value.currentPlayerIndex; // Set the winner if score is zero
    }

    currentThrows.value.length = 0;

    gameState.value.currentPlayerIndex++;

    // Return to first player if all players have thrown
    if (gameState.value.currentPlayerIndex >= gameState.value.players.length) {
      gameState.value.currentPlayerIndex = 0;
      gameState.value.round++;
    }
  }

  const canUndoThrow = computed(() => {
    return currentThrows.value.length > 0;
  });
  function undoThrow() {
    if (!canUndoThrow.value) {
      return;
    }
    currentThrows.value.pop();
  }

  const canUndoTurn = computed(() => {
    return (
      currentThrows.value.length === 0 &&
      (gameState.value.currentPlayerIndex > 0 || gameState.value.round > 1)
    );
  });

  /**
   * Undo the last turn. It moves the last player throws to the current throws,
   * and recrements the player's score.
   */
  function undoTurn() {
    if (!canUndoTurn.value) {
      return;
    }

    gameState.value.winnerIndex = null; // Reset winner index
    gameState.value.currentPlayerIndex--;
    if (gameState.value.currentPlayerIndex < 0) {
      gameState.value.currentPlayerIndex = gameState.value.players.length - 1;
      gameState.value.round--;
    }
    const currentPlayer =
      gameState.value.players[gameState.value.currentPlayerIndex];
    // Restore the last round's throws
    currentThrows.value = currentPlayer.throws[gameState.value.round - 1];
    // Remove the last round's throws
    currentPlayer.throws.splice(gameState.value.round - 1, 1);
    // Reset the score for the current player
    currentPlayer.table = mergeTableWithThrows(
      currentPlayer.table,
      currentThrows.value,
      true
    );
  }

  // Players sorted by score
  function getRemainingThrows(table: CricketTable) {
    return CricketNumbersList.reduce((acc, numberKey) => {
      return acc + Math.max(3 - table[numberKey], 0);
    }, 0);
  }
  const rankings = computed(() =>
    gameState.value.players.toSorted(
      (p1, p2) => getRemainingThrows(p1.table) - getRemainingThrows(p2.table)
    )
  );

  return {
    gameState,
    rankings,
    currentThrows,
    currentPlayerHighlights,
    currentPlayerFutureTable,
    waitingForConfirmation,
    winner,
    recordThrow,
    confirmThrows,
    canUndoThrow,
    undoThrow,
    canUndoTurn,
    undoTurn,
  };
}
