<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

const route = useRoute();

const {
  state,
  players,
  currentPlayer,
  round,
  ranking,
  currentThrows,
  invalidTurn,
  winner,
  currentPlayerHighlights,
  winningCombination,
  recordThrow,
  waitingForConfirmation,
  confirmThrows,
  canUndo,
  undo,
  revenge,
} = useDoubleOut(route.params.double_out_id as string);

defineShortcuts({
  enter: () => confirmThrows(),
  backspace: () => undo(),
});
</script>

<template>
  <div>
    <DartWinnerOverlay
      to="/"
      :winner="winner"
      :rankings="ranking"
      @revenge="revenge"
      @undo-turn="undo"
    />

    <SplitterGroup auto-save-id="double-out-layout" direction="horizontal">
      <SplitterPanel
        class="max-h-full overflow-y-auto p-3 w-40"
        :default-size="20"
      >
        <DartThrowStack
          :player-names="state.players"
          :throws="state.throws"
          show-total
        />
      </SplitterPanel>

      <SplitterResizeHandle class="bg-accented w-px" />

      <SplitterPanel class="col-span-2 flex-1 p-3 space-y-3">
        <DartBoard
          :disabled="waitingForConfirmation"
          :hits="currentThrows"
          :highlights="currentPlayerHighlights"
          @hit="recordThrow"
        />

        <DartCurrentThrows
          :can-undo="canUndo"
          :current-throws="currentThrows"
          :invalid-turn="invalidTurn"
          show-score
          :winning-combination="winningCombination"
          @undo="undo"
          @confirm-throws="confirmThrows"
        />
      </SplitterPanel>

      <SplitterResizeHandle class="bg-accented w-px" />

      <SplitterPanel
        class="flex flex-col gap-4 h-full p-3 w-120"
        :default-size="25"
      >
        <DartRound :round="round" />
        <DoubleOutPlayerScore
          v-for="(player, i) in players"
          :key="i"
          :player="player"
          :is-current-player="currentPlayer === i"
          :invalid-turn="invalidTurn"
          :initial-score="state.initialScore"
        />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
