<script setup lang="ts">
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
  recordThrow,
} = useCricket(route.params.cricket_id as string);

defineShortcuts({
  enter: () => confirmThrows(true),
  backspace: () => undoThrow(),
  escape: () => undoTurn(),
});
</script>

<template>
  <div>
    <DartWinnerOverlay
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
            :disabled="!waitingForConfirmation"
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
          class="max-h-[70vh] w-full"
          @hit="recordThrow"
        />

        <div class="grid grid-cols-3 text-6xl font-medium">
          <div v-for="i in 3" :key="i" class="p-6 text-center">
            <span v-if="currentThrows[i - 1]" class="font-bold">
              {{ currentThrows[i - 1]?.dartThrow.label }}
            </span>
            <span v-else>·</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 h-full">
        <div class="text-4xl font-bold px-4 text-center">
          Tour {{ gameState.round }}
        </div>
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
          <div class="grid grid-cols-7 rounded-lg text-lg font-bold">
            <span>20</span>
            <span>19</span>
            <span>18</span>
            <span>17</span>
            <span>16</span>
            <span>15</span>
            <span>Bull</span>
            <CricketScoreIcon :score="player.table[20]" />
            <CricketScoreIcon :score="player.table[19]" />
            <CricketScoreIcon :score="player.table[18]" />
            <CricketScoreIcon :score="player.table[17]" />
            <CricketScoreIcon :score="player.table[16]" />
            <CricketScoreIcon :score="player.table[15]" />
            <CricketScoreIcon :score="player.table.bull" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
