<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";
import { CricketScoreTable } from "#components";

const route = useRoute();

const {
  state,
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
} = useCricket(route.params.cricket_id as string);

defineShortcuts({
  enter: () => confirmThrows(),
  backspace: () => undo(),
});
</script>

<template>
  <div>
    <DartWinnerOverlay
      to="/?tab=1"
      :winner="winner"
      :rankings="ranking"
      @revenge="revenge"
      @undo-turn="undo"
    />

    <SplitterGroup auto-save-id="cricket-layout" direction="horizontal">
      <SplitterPanel class="w-40 max-h-full overflow-y-auto" :default-size="20">
        <DartThrowStack :player-names="state.players" :throws="state.throws" />
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
          @auto-confirm-throws="confirmThrows"
        />
      </SplitterPanel>

      <SplitterResizeHandle class="mx-3 w-px bg-accented" />

      <SplitterPanel
        class="flex flex-col gap-4 h-full w-120"
        :default-size="25"
      >
        <DartRound :round="round" />
        <CricketScoreTable
          v-for="(player, i) in players"
          :key="i"
          :player-name="player.name"
          :is-current-player="currentPlayer === i"
          :table="player.table"
        />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
