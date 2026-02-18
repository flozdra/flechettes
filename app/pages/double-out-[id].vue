<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

const route = useRoute();
const settings = useSettings();

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
} = useDoubleOut(`double-out-${route.params.id}`);

defineShortcuts({
  enter: () => confirmThrows(),
  backspace: () => undo(),
});
</script>

<template>
  <div>
    <GameWinnerOverlay
      to="/"
      :winner="winner"
      :rankings="ranking"
      @revenge="revenge"
      @undo-turn="undo"
    />

    <div class="lg:hidden p-1 space-y-3">
      <GameRound :round="round" />
      <div class="flex gap-1 overflow-x-auto">
        <DoubleOutPlayerScoreMobile
          v-for="(player, i) in players"
          :key="i"
          :player="player"
          :is-current-player="currentPlayer === i"
          :invalid-turn="invalidTurn"
          :initial-score="state.initialScore"
        />
      </div>

      <GameDartboardMobile
        class="min-h-[calc(100vh-348px)]"
        :disabled="waitingForConfirmation"
        :hits="currentThrows"
        :highlights="currentPlayerHighlights"
        @hit="recordThrow"
      />

      <GameCurrentThrowsMobile
        :can-undo="canUndo"
        :current-throws="currentThrows"
        :invalid-turn="invalidTurn"
        show-score
        :winning-combination="winningCombination"
        @undo="undo"
        @confirm-throws="confirmThrows"
      />
    </div>

    <div class="hidden lg:block">
      <SplitterGroup auto-save-id="double-out-layout" direction="horizontal">
        <SplitterPanel
          class="max-h-full overflow-y-auto p-3 w-40"
          :default-size="20"
        >
          <GameThrowStack
            :player-names="state.players"
            :throws="state.throws"
            show-total
          />
        </SplitterPanel>

        <SplitterResizeHandle class="bg-accented w-px" />

        <SplitterPanel class="col-span-2 flex-1 p-3 space-y-3">
          <GameDartboardMobile
            v-if="settings.alwaysShowDartMobile"
            class="min-h-[calc(100vh-192px)]"
            :disabled="waitingForConfirmation"
            :hits="currentThrows"
            :highlights="currentPlayerHighlights"
            @hit="recordThrow"
          />
          <GameDartboard
            v-else
            class="max-h-[calc(100vh-192px)]"
            :disabled="waitingForConfirmation"
            :hits="currentThrows"
            :highlights="currentPlayerHighlights"
            @hit="recordThrow"
          />

          <GameCurrentThrows
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
          <GameRound :round="round" />
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
  </div>
</template>
