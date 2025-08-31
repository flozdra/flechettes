<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";

const route = useRoute();
const settings = useSettings();

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

    <div class="lg:hidden p-1 space-y-3">
      <DartRound :round="round" :custom-label="roundLabel" />
      <div class="flex gap-1 overflow-x-auto">
        <HalveItPlayerScoreMobile
          v-for="(player, i) in players"
          :key="i"
          :player="player"
          :is-current-player="currentPlayer === i"
        />
      </div>

      <DartBoardMobile
        class="min-h-[calc(100vh_-_348px)]"
        :disabled="waitingForConfirmation"
        :hits="currentThrows"
        :highlights="roundTargets"
        @hit="recordThrow"
      />

      <DartCurrentThrowsMobile
        :can-undo="canUndo"
        :current-throws="currentThrows"
        @undo="undo"
        @confirm-throws="confirmThrows"
      />
    </div>

    <div class="hidden lg:block">
      <SplitterGroup auto-save-id="halve-it-layout" direction="horizontal">
        <SplitterPanel
          class="max-h-full overflow-y-auto p-3 w-40"
          :default-size="20"
        >
          <DartThrowStack
            :player-names="state.players"
            :throws="state.throws"
          />
        </SplitterPanel>

        <SplitterResizeHandle class="bg-accented w-px" />

        <SplitterPanel class="col-span-2 flex-1 p-3 space-y-3">
          <DartBoardMobile
            v-if="settings.alwaysShowDartMobile"
            class="min-h-[calc(100vh_-_192px)]"
            :disabled="waitingForConfirmation"
            :hits="currentThrows"
            :highlights="roundTargets"
            @hit="recordThrow"
          />
          <DartBoard
            v-else
            class="max-h-[calc(100vh_-_192px)]"
            :disabled="waitingForConfirmation"
            :hits="currentThrows"
            :highlights="roundTargets"
            @hit="recordThrow"
          />

          <DartCurrentThrows
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
  </div>
</template>
