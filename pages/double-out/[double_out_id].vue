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
  currentThrowsScore,
  winningCombination,
  recordThrow,
} = useDoubleOut(route.params.double_out_id as string);

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

    <div class="grid grid-cols-3 gap-3">
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
          @hit="recordThrow"
        />

        <div class="grid grid-cols-3 text-5xl font-medium">
          <div v-for="i in 3" :key="i" class="p-6 text-center">
            <span v-if="currentThrows[i - 1]" class="font-bold">
              {{ currentThrows[i - 1]?.dartThrow.label }}
            </span>
            <span
              v-else-if="winningCombination?.throws[i - 1]"
              class="italic opacity-50"
            >
              {{
                winningCombination.throws[i - 1].id === "OUT"
                  ? "·"
                  : winningCombination.throws[i - 1].label
              }}
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
          class="px-4 py-2 rounded-lg flex gap-3 text-4xl font-bold border border-accented"
          :class="{
            'border bg-primary/10 border-primary/25 ':
              gameState.currentPlayerIndex === i,
            'opacity-60 italic font-medium': gameState.currentPlayerIndex !== i,
          }"
        >
          {{ player.name }}
          <div class="grow" />
          <div class="text-right">
            {{ player.score }}

            <div
              v-if="
                gameState.currentPlayerIndex === i && currentThrows.length > 0
              "
              :class="
                currentThrowsScore > player.score
                  ? 'text-error-500'
                  : 'opacity-50'
              "
            >
              - {{ currentThrowsScore }}
            </div>
            <div v-else>‎</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
