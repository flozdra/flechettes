import { useLocalStorage } from "@vueuse/core";
import {
  DartThrows,
  type DartThrow,
  type DartThrowRecord,
} from "~/components/dart";

type Combination = { total: number; throws: DartThrow[] };

/**
 * Predictions for the upcomuing throws.
 * It is used when a player can win the game within the next turn.
 */
const allPossibleThrows = Object.values(DartThrows);
const possibleCombinations: Combination[] = [];
for (let i = allPossibleThrows.length - 1; i >= 0; i--) {
  for (let j = allPossibleThrows.length - 1; j >= 0; j--) {
    for (let k = allPossibleThrows.length - 1; k >= 0; k--) {
      const throws = [
        allPossibleThrows[i],
        allPossibleThrows[j],
        allPossibleThrows[k],
      ];
      const total = throws[0].score + throws[1].score + throws[2].score;
      possibleCombinations.push({ total, throws });
    }
  }
}

export type GameState = {
  id: string;
  createdAt: number;
  players: { name: string; score: number; throws: DartThrowRecord[][] }[];
  round: number;
  currentPlayerIndex: number;
  winnerIndex: number | null;
};

export function createNew301(playerName: string[]) {
  const gameId = `game-301-${Date.now()}`;
  useLocalStorage<GameState>(gameId, {
    id: gameId,
    createdAt: Date.now(),
    players: playerName.map((name) => ({ name, score: 301, throws: [] })),
    round: 1,
    currentPlayerIndex: 0,
    winnerIndex: null,
  });
  return gameId;
}

/**
 * Return the logic of a game 301 in darts
 */
export function use301(gameId: string) {
  const gameState = useLocalStorage<GameState>(gameId, {} as GameState, {
    deep: true,
  });
  if (Object.keys(gameState.value).length === 0) {
    throw new Error("Game data not found. Please start a new game.");
  }

  const currentThrows = ref<DartThrowRecord[]>([]);
  const currentThrowsScore = computed(() =>
    currentThrows.value.reduce((sum, record) => sum + record.dartThrow.score, 0)
  );

  const winner = computed(() =>
    gameState.value.winnerIndex !== null
      ? gameState.value.players[gameState.value.winnerIndex]
      : null
  );

  const waitingForConfirmation = ref(false);

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

    if (
      currentThrows.value.length === 3 ||
      gameState.value.players[gameState.value.currentPlayerIndex].score ===
        currentThrowsScore.value
    ) {
      waitingForConfirmation.value = true;
      return;
    }
  }

  function confirmThrows() {
    if (!waitingForConfirmation.value) return;

    const currentPlayer =
      gameState.value.players[gameState.value.currentPlayerIndex];
    const roundIndex = gameState.value.round - 1;

    currentPlayer.throws[roundIndex] = [...currentThrows.value];
    currentPlayer.score -= currentThrowsScore.value;
    if (currentPlayer.score < 0) {
      currentPlayer.score += currentThrowsScore.value; // Revert score if it goes below zero
    }
    if (currentPlayer.score === 0) {
      gameState.value.winnerIndex = gameState.value.currentPlayerIndex; // Set the winner if score is zero
    }

    waitingForConfirmation.value = false;
    currentThrows.value.length = 0;

    gameState.value.currentPlayerIndex++;

    // Return to first player if all players have thrown
    if (gameState.value.currentPlayerIndex >= gameState.value.players.length) {
      gameState.value.currentPlayerIndex = 0;
      gameState.value.round++;
    }
  }

  const winningCombination = computed<Combination | null>(() => {
    const currentPlayerScore =
      gameState.value.players[gameState.value.currentPlayerIndex].score;

    let possibleThrows: Combination[] = [];
    if (currentThrows.value.length === 0) {
      possibleThrows = possibleCombinations.filter(
        (combination) => combination.total === currentPlayerScore
      );
    }
    if (currentThrows.value.length === 1) {
      possibleThrows = possibleCombinations.filter(
        (combination) =>
          combination.throws[0].id === currentThrows.value[0].dartThrow.id &&
          combination.total === currentPlayerScore
      );
    }
    if (currentThrows.value.length === 2) {
      possibleThrows = possibleCombinations.filter(
        (combination) =>
          combination.throws[0].id === currentThrows.value[0].dartThrow.id &&
          combination.throws[1].id === currentThrows.value[1].dartThrow.id &&
          combination.total === currentPlayerScore
      );
    }
    possibleThrows.sort(
      (a, b) =>
        b.throws[0].score - a.throws[0].score ||
        b.throws[1].score - a.throws[1].score ||
        b.throws[2].score - a.throws[2].score
    );
    return possibleThrows[0] ?? null;
  });

  const canUndoThrow = computed(() => {
    return currentThrows.value.length > 0;
  });
  function undoThrow() {
    if (!canUndoThrow.value) {
      return;
    }
    currentThrows.value.pop();
    waitingForConfirmation.value = false;
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
    currentPlayer.score += currentThrowsScore.value;
    waitingForConfirmation.value = true;
  }
// 
  // Players sorted by score
  const rankings = computed(() =>
    gameState.value.players.toSorted((p1, p2) => p1.score - p2.score)
  );

  return {
    gameState,
    rankings,
    currentThrows,
    currentThrowsScore,
    waitingForConfirmation,
    winner,
    winningCombination,
    recordThrow,
    confirmThrows,
    canUndoThrow,
    undoThrow,
    canUndoTurn,
    undoTurn,
  };
}
