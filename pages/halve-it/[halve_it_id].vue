<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

const route = useRoute();

const {
  state,
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
} = useHalveIt(route.params.halve_it_id as string);

defineShortcuts({
  enter: () => confirmThrows(),
  backspace: () => undo(),
});
</script>

<template>
  <div>
    <DartWinnerOverlay
      to="/?tab=2"
      :winner="winner"
      :rankings="ranking"
      @revenge="revenge"
      @undo-turn="undo"
    />

    <SplitterGroup auto-save-id="halve-it-layout" direction="horizontal">
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
          :highlights="roundTargets"
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
        <DartRound :round="round" :custom-label="roundLabel" />
        <HalveItPlayerScore
          v-for="(player, i) in players"
          :key="i"
          :player="player"
          :is-current-player="currentPlayer === i"
        />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
