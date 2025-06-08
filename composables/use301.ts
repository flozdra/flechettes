import type { DartThrow, DartThrowRecord } from "~/components/dart";

/**
 * Return the logic of a game 301 in darts
 */
export function use301(playerNames: string[]) {
  const players = playerNames.map((name) => ({
    name,
    score: 180,
    throws: [] as DartThrowRecord[][],
  }));

  const round = ref(1);

  const currentPlayerIndex = ref(0);
  const currentThrows = ref<DartThrowRecord[]>([]);
  const currentThrowsScore = computed(() =>
    currentThrows.value.reduce((sum, record) => sum + record.dartThrow.score, 0)
  );

  const winnerIndex = ref<number | null>(null);
  const winner = computed(() =>
    winnerIndex.value !== null ? players[winnerIndex.value] : null
  );

  const waitingForConfirmation = ref(false);

  function recordThrow(
    dartThrow: DartThrow,
    coordinates: { x: number; y: number }
  ) {
    if (waitingForConfirmation.value) return;

    const roundIndex = round.value - 1;

    currentThrows.value.push({
      id: roundIndex + currentThrows.value.length + 1,
      dartThrow,
      coordinates,
    });

    if (
      currentThrows.value.length === 3 ||
      players[currentPlayerIndex.value].score === currentThrowsScore.value
    ) {
      waitingForConfirmation.value = true;
      return;
    }
  }

  function confirmThrows() {
    if (!waitingForConfirmation.value) return;

    const currentPlayer = players[currentPlayerIndex.value];
    const roundIndex = round.value - 1;

    currentPlayer.throws[roundIndex] = [...currentThrows.value];
    currentPlayer.score -= currentThrowsScore.value;
    if (currentPlayer.score < 0) {
      currentPlayer.score += currentThrowsScore.value; // Revert score if it goes below zero
    }
    if (currentPlayer.score === 0) {
      winnerIndex.value = currentPlayerIndex.value; // Set the winner if score is zero
    }

    waitingForConfirmation.value = false;
    currentThrows.value.length = 0;

    currentPlayerIndex.value++;

    // Return to first player if all players have thrown
    if (currentPlayerIndex.value >= players.length) {
      currentPlayerIndex.value = 0;
      round.value++;
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
    waitingForConfirmation.value = false;
  }

  const canUndoTurn = computed(() => {
    return (
      currentThrows.value.length === 0 &&
      (currentPlayerIndex.value > 0 || round.value > 1)
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

    winnerIndex.value = null; // Reset winner index
    currentPlayerIndex.value--;
    if (currentPlayerIndex.value < 0) {
      currentPlayerIndex.value = players.length - 1;
      round.value--;
    }
    const currentPlayer = players[currentPlayerIndex.value];
    // Restore the last round's throws
    currentThrows.value = currentPlayer.throws[round.value - 1];
    // Remove the last round's throws
    currentPlayer.throws.splice(round.value - 1, 1);
    // Reset the score for the current player
    currentPlayer.score += currentThrowsScore.value;
    waitingForConfirmation.value = true;
  }

  return {
    players,
    round,
    currentPlayerIndex,
    currentThrows,
    currentThrowsScore,
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
