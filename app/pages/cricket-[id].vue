<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";
import { CricketScoreTable } from "#components";

const route = useRoute();
const settings = useSettings();

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
} = useCricket(`cricket-${route.params.id}`);

defineShortcuts({
  enter: () => confirmThrows(),
  backspace: () => undo(),
});
</script>

<template>
  <div>
    <GameWinnerOverlay
      to="/?tab=1"
      :winner="winner"
      :rankings="ranking"
      @revenge="revenge"
      @undo-turn="undo"
    />

    <div class="lg:hidden p-1 space-y-3">
      <GameRound :round="round" />
      <div class="flex gap-1 overflow-x-auto">
        <CricketScoreTableMobile
          v-for="(player, i) in players"
          :key="i"
          :player-name="player.name"
          :is-current-player="currentPlayer === i"
          :table="player.table"
        />
      </div>

      <GameDartboardMobile
        class="min-h-[calc(100vh-520px)]"
        :disabled="waitingForConfirmation"
        :hits="currentThrows"
        :highlights="currentPlayerHighlights"
        only-cricket
        @hit="recordThrow"
      />

      <GameCurrentThrowsMobile
        :can-undo="canUndo"
        :current-throws="currentThrows"
        @undo="undo"
        @confirm-throws="confirmThrows"
      />
    </div>

    <div class="hidden lg:block">
      <SplitterGroup auto-save-id="cricket-layout" direction="horizontal">
        <SplitterPanel
          class="max-h-full overflow-y-auto p-3 w-40"
          :default-size="20"
        >
          <GameThrowStack
            :player-names="state.players"
            :throws="state.throws"
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
            only-cricket
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
  </div>
</template>
