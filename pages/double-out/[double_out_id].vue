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
      <SplitterPanel class="w-40 max-h-full overflow-y-auto" :default-size="20">
        <DartThrowStack
          :player-names="state.players"
          :throws="state.throws"
          show-total
        />
      </SplitterPanel>

      <SplitterResizeHandle class="mx-3 w-px bg-accented" />

      <SplitterPanel class="space-y-3 col-span-2 flex-1">
        <DartCommands
          :can-undo="canUndo"
          @undo="undo"
          @confirm-throws="confirmThrows"
        />

        <DartBoard
          :disabled="waitingForConfirmation"
          :hits="currentThrows"
          :highlights="currentPlayerHighlights"
          @hit="recordThrow"
        />

        <DartCurrentThrows
          :current-throws="currentThrows"
          :invalid-turn="invalidTurn"
          show-score
          :winning-combination="winningCombination"
          @auto-confirm-throws="confirmThrows"
        />
      </SplitterPanel>

      <SplitterResizeHandle class="mx-3 w-px bg-accented" />

      <SplitterPanel
        class="flex flex-col gap-4 h-full w-120"
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
