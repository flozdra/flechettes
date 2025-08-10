import { useLocalStorage } from "@vueuse/core";

export type CricketState = {
  id: string;
  createdAt: number;
  players: string[];
  throws: DartThrowRecord[][];
  version: number; // Versioning for future updates
};

/** Create a new Cricket game and navigate to it */
export function createNewCricket(players: string[]) {
  const gameId = `cricket-${Date.now()}`;
  useLocalStorage<CricketState>(gameId, {
    id: gameId,
    createdAt: Date.now(),
    players,
    throws: [[]],
    version: 2,
  });
  navigateTo(`/cricket/${gameId}`);
}

// prettier-ignore
const CricketNumbersList = ["15", "16", "17", "18", "19", "20", "bull"] as const;
type CricketNumbers = (typeof CricketNumbersList)[number];
export type CricketTable = Record<CricketNumbers, number>;
// prettier-ignore
const defaultTable: CricketTable = { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, bull: 0 }

/** Map the key numbers with the corresponding dart throws */
const keyThrows: { key: CricketNumbers; base: number; throws: string[] }[] = [
  { key: "15", base: 15, throws: ["S15", "D15", "T15"] },
  { key: "16", base: 16, throws: ["S16", "D16", "T16"] },
  { key: "17", base: 17, throws: ["S17", "D17", "T17"] },
  { key: "18", base: 18, throws: ["S18", "D18", "T18"] },
  { key: "19", base: 19, throws: ["S19", "D19", "T19"] },
  { key: "20", base: 20, throws: ["S20", "D20", "T20"] },
  { key: "bull", base: 25, throws: ["SB", "DB"] },
];

/** Returns the number of achieved throws for a cricket table (max 21) */
export function getAchievedThrows(table: CricketTable) {
  return CricketNumbersList.reduce((acc, numberKey) => {
    return acc + Math.min(table[numberKey], 3);
  }, 0);
}

/**
 * Return the logic of a Cricket game.
 */
export function useCricket(gameId: string) {
  const gameState = useLocalStorage(gameId, {} as CricketState, { deep: true });
  if (Object.keys(gameState.value).length === 0) {
    gameState.value = null; // Remove the game state from localStorage
    throw new Error("Game data not found. Please start a new game.");
  }
  // Convert from version 1 to version 2 if needed
  if (gameState.value.version === 1) {
    gameState.value = convertCricketFromV1ToV2(
      gameState.value as unknown as CricketStateV1
    );
  }

  /** Current turn of the game (starts at 0) */
  const turn = computed(() => gameState.value.throws.length - 1);

  /** Current round of the game (starts at 1) */
  const round = computed(() => {
    return Math.floor(turn.value / gameState.value.players.length) + 1;
  });

  /** Players with their score table */
  const players = computed(() => {
    const playerScores = gameState.value.players.map((name) => ({
      name,
      table: { ...defaultTable },
    }));

    for (let i = 0; i <= turn.value; i++) {
      const playerIndex = i % gameState.value.players.length;
      const throwRecords = gameState.value.throws[i];
      const playerTable = playerScores[playerIndex].table;
      for (const record of throwRecords) {
        const keyThrow = keyThrows.find((kt) =>
          kt.throws.includes(record.dartThrow.id)
        );
        if (keyThrow) {
          playerTable[keyThrow.key] += record.dartThrow.score / keyThrow.base;
        }
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
    players.value.toSorted(
      (p1, p2) => getAchievedThrows(p2.table) - getAchievedThrows(p1.table)
    )
  );

  /** Current winner if exists */
  const winner = computed(() => {
    return players.value.find((p) => getAchievedThrows(p.table) === 21) || null;
  });

  /** If the current player's turn is ended */
  const waitingForConfirmation = computed(() => {
    return currentThrows.value.length === 3 || winner.value !== null;
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

  /** Return the throw IDs of the current player's remaining numbers */
  const currentPlayerHighlights = computed(() => {
    return CricketNumbersList.filter((key) => {
      return players.value[currentPlayer.value].table[key] < 3;
    })
      .map<DartThrowId[]>((key) => {
        return key === "bull"
          ? ["SB", "DB"]
          : [`S${key}`, `D${key}`, `T${key}`];
      })
      .flat();
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
    createNewCricket(gameState.value.players);
  }

  return {
    state: computed(() => gameState.value), // Read-only state
    players,
    currentPlayer,
    round,
    ranking,
    currentThrows,
    winner,
    currentPlayerHighlights,
    recordThrow,
    waitingForConfirmation,
    confirmThrows,
    canUndo,
    undo,
    revenge,
  };
}
export type CricketGame = ReturnType<typeof useCricket>;

/*
|--------------------------------------------------------------------------
| Cricket state versioning
|--------------------------------------------------------------------------
*/
type CricketStateV1 = {
  id: string;
  createdAt: number;
  players: { name: string; table: CricketTable; throws: DartThrowRecord[][] }[];
  round: number;
  currentPlayerIndex: number;
  winnerIndex: number | null;
  version: number; // Versioning for future updates
};

/**
 * Convert a Cricket game from version 1 to version 2.
 */
export function convertCricketFromV1ToV2(game: CricketStateV1): CricketState {
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
    players: game.players.map(({ name }) => name),
    throws,
    version: 2,
  };
}
