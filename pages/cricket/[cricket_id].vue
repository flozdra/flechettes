<script setup lang="ts">
import { CricketScoreTable } from "#components";

const route = useRoute();

const {
  gameState,
  rankings,
  winner,
  canUndoTurn,
  undoTurn,
  canUndoThrow,
  undoThrow,
  waitingForConfirmation,
  confirmThrows,
  currentThrows,
  currentPlayerFutureTable,
  currentPlayerHighlights,
  recordThrow,
} = useCricket(route.params.cricket_id as string);

defineShortcuts({
  enter: () => confirmThrows(),
  backspace: () => undoThrow(),
  escape: () => undoTurn(),
});
</script>

<template>
  <div>
    <DartWinnerOverlay
      to="/?tab=1"
      :winner="winner"
      :rankings="rankings"
      @undo-turn="undoTurn"
    />

    <div class="grid grid-cols-3">
      <div class="space-y-3 col-span-2">
        <div class="flex gap-3">
          <UButton
            color="error"
            :hidden="!canUndoTurn"
            icon="i-lucide-arrow-left"
            size="xl"
            @click="undoTurn"
          >
            Revenir au tour précédent
          </UButton>
          <div class="grow" />
          <UButton
            color="error"
            :hidden="!canUndoThrow"
            icon="i-lucide-undo"
            size="xl"
            @click="undoThrow"
          >
            Annuler
          </UButton>
          <UButton
            color="success"
            trailing-icon="i-lucide-check"
            size="xl"
            @click="confirmThrows"
          >
            Confirmer
          </UButton>
        </div>

        <DartBoard
          :disabled="waitingForConfirmation"
          :hits="currentThrows"
          :highlights="currentPlayerHighlights"
          @hit="recordThrow"
        />

        <div class="grid grid-cols-3 text-5xl whitespace-nowrap">
          <div v-for="i in 3" :key="i" class="py-3 text-center">
            <span v-if="currentThrows[i - 1]" class="font-bold">
              {{ currentThrows[i - 1]?.dartThrow.label }}
            </span>
            <span v-else>·</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 h-full">
        <DartRound :round="gameState.round" />
        <div
          v-for="(player, i) in gameState.players"
          :key="i"
          class="px-2 pt-2 pb-4 rounded-lg space-y-3 text-center border border-accented"
          :class="{
            'border bg-primary/10 border-primary/25 ':
              gameState.currentPlayerIndex === i,
            'opacity-60 italic font-medium': gameState.currentPlayerIndex !== i,
          }"
        >
          <div class="text-3xl font-bold">{{ player.name }}</div>
          <CricketScoreTable
            :table="
              gameState.currentPlayerIndex === i
                ? currentPlayerFutureTable
                : player.table
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
