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
} = use301(route.params.game as string);
</script>

<template>
  <div>
    <div
      v-if="winner"
      class="absolute inset-0 z-10 w-full p-12 bg-default/50 backdrop-blur-lg font-bold space-y-12"
    >
      <UButton
        color="error"
        icon="i-lucide-arrow-left"
        size="lg"
        @click="undoTurn"
        >Revenir au tour précédent</UButton
      >

      <div class="text-center text-8xl mb-12">
        {{ winner?.name }} a gagné ! 🏆
      </div>
      <div class="text-4xl leading-relaxed">
        <div
          v-for="(player, i) in rankings"
          :key="i"
          class="grid grid-cols-2 max-w-md mx-auto gap-3"
        >
          <span class="text-left">
            {{ i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1 }}
            {{ player.name }}
          </span>
          <span class="text-right"> {{ player.score }} </span>
        </div>
      </div>

      <div class="mt-6 text-center">
        <UButton color="primary" icon="i-lucide-home" size="xl" to="/">
          Retour au menu
        </UButton>
      </div>
    </div>

    <div class="grid grid-cols-3">
      <div class="col-span-2">
        <div class="flex gap-3">
          <UButton
            color="error"
            :hidden="!canUndoTurn"
            icon="i-lucide-arrow-left"
            size="xl"
            @click="undoTurn"
            >Revenir au tour précédent</UButton
          >
          <div class="grow" />
          <UButton
            color="error"
            :hidden="!canUndoThrow"
            icon="i-lucide-undo"
            size="xl"
            @click="undoThrow"
            >Annuler</UButton
          >
          <UButton
            color="success"
            :disabled="!waitingForConfirmation"
            trailing-icon="i-lucide-check"
            size="xl"
            @click="confirmThrows"
            >Confirmer</UButton
          >
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
            <span
              v-else-if="winningCombination?.throws[i - 1]"
              class="italic opacity-50"
            >
              {{ winningCombination.throws[i - 1].label }}
            </span>
            <span v-else>·</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-24 h-full">
        <div class="text-6xl font-bold px-6 text-center">
          Tour {{ gameState.round }}
        </div>
        <div
          v-for="(player, i) in gameState.players"
          :key="i"
          class="flex gap-3 text-5xl font-bold px-6"
          :class="{
            'opacity-40 italic font-medium': gameState.currentPlayerIndex !== i,
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
                  ? 'text-red-500'
                  : 'text-gray-400'
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
