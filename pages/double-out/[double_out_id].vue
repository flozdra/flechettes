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
  enter: () => confirmThrows(),
  backspace: () => undoThrow(),
  escape: () => undoTurn(),
});
</script>

<template>
  <div>
    <DartWinnerOverlay
      to="/"
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

        <div class="grid grid-cols-4 text-5xl whitespace-nowrap">
          <div v-for="i in 3" :key="i" class="py-3 text-center">
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

          <UBadge
            class="justify-center w-30 mx-auto text-5xl rounded-xl font-bold"
            variant="subtle"
            :color="
              currentThrowsScore === 0
                ? 'neutral'
                : currentThrowsScore >
                  gameState.players[gameState.currentPlayerIndex].score
                ? 'error'
                : 'success'
            "
          >
            {{ currentThrowsScore }}
          </UBadge>
        </div>
      </div>

      <div class="flex flex-col gap-4 h-full">
        <DartRound :round="gameState.round" />
        <div
          v-for="(player, i) in gameState.players"
          :key="i"
          class="px-4 py-2 rounded-lg text-4xl font-bold border border-accented"
          :class="{
            'border bg-primary/10 border-primary/25 ':
              gameState.currentPlayerIndex === i,
            'opacity-60 italic font-medium': gameState.currentPlayerIndex !== i,
          }"
        >
          <div class="flex items-center justify-between">
            <span>{{ player.name }}</span>
            <span>{{ player.score }}</span>
          </div>
          <div class="flex items-center text-sm font-normal">
            Derniers lancés :
            <div class="grow" />
            <span
              v-for="(t, j) in player.throws[player.throws.length - 1] ?? []"
              :key="j"
            >
              {{ t.dartThrow.label }}
              <span class="mx-1">{{ j < 2 ? " · " : "" }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
