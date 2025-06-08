<script setup lang="ts">
const game = reactive(use301(["Florian", "Rayan"]));
</script>

<template>
  <div>
    <div class="mb-3">Partie en cours : {{ $route.params.game }}</div>

    <div
      v-if="game.winner"
      class="absolute inset-0 z-10 w-full p-12 bg-default/50 backdrop-blur-lg font-bold space-y-12"
    >
      <UButton
        color="error"
        icon="i-lucide-arrow-left"
        size="lg"
        @click="game.undoTurn"
        >Revenir au tour précédent</UButton
      >

      <div class="text-center text-8xl mb-12">
        🏆 {{ game.winner.name }} a gagné ! 🏆
      </div>
      <div class="text-center text-4xl leading-relaxed">
        <div
          v-for="(player, i) in game.players.toSorted(
            (p1, p2) => p1.score - p2.score
          )"
          :key="i"
          class="grid grid-cols-2 max-w-lg mx-auto gap-3"
        >
          <span :class="{ 'font-bold': player === game.winner }">
            {{ i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1 }}
            {{ player.name }} </span
          ><span> {{ player.score }} </span>
        </div>
      </div>

      <div class="mt-6 text-center">
        <UButton color="primary" icon="i-lucide-home" size="xl" to="/"
          >Retour au menu</UButton
        >
      </div>
      <div class="flex gap-3">
        <div class="grow" />
      </div>
    </div>

    <div class="grid grid-cols-3">
      <div class="col-span-2">
        <div class="flex gap-3">
          <UButton
            color="error"
            :hidden="!game.canUndoTurn"
            icon="i-lucide-arrow-left"
            size="xl"
            @click="game.undoTurn"
            >Revenir au tour précédent</UButton
          >
          <div class="grow" />
          <UButton
            color="error"
            :hidden="!game.canUndoThrow"
            icon="i-lucide-undo"
            size="xl"
            @click="game.undoThrow"
            >Annuler</UButton
          >
          <UButton
            color="success"
            :disabled="!game.waitingForConfirmation"
            trailing-icon="i-lucide-check"
            size="xl"
            @click="game.confirmThrows"
            >Confirmer</UButton
          >
        </div>

        <DartBoard
          :disabled="game.waitingForConfirmation"
          :hits="game.currentThrows"
          class="max-h-[70vh] w-full"
          @hit="game.recordThrow"
        />
        <div class="grid grid-cols-3 text-6xl font-bold">
          <div v-for="i in 3" :key="i" class="p-6 text-center">
            {{ game.currentThrows[i - 1]?.dartThrow.label ?? "·" }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-24 h-full">
        <div class="text-6xl font-bold px-6 text-center">
          Tour {{ game.round }}
        </div>
        <div
          v-for="(player, i) in game.players"
          :key="i"
          class="flex gap-3 text-5xl font-bold px-6"
          :class="{
            'opacity-40 italic font-medium': game.currentPlayerIndex !== i,
          }"
        >
          {{ player.name }}
          <div class="grow" />
          <div class="text-right">
            {{ player.score }}

            <div
              v-if="
                game.currentPlayerIndex === i && game.currentThrows.length > 0
              "
              :class="
                game.currentThrowsScore > player.score
                  ? 'text-red-500'
                  : 'text-gray-400'
              "
            >
              - {{ game.currentThrowsScore }}
            </div>
            <div v-else>‎</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
