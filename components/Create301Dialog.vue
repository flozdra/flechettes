<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";

const knownPlayers = useLocalStorage("knownPlayers", [
  "Charles",
  "Florian",
  "Fred",
  "Rayan",
  "Nathaëlle",
]);

const players = ref<string[]>(["", "", "", ""]);

const options = computed(() => {
  return knownPlayers.value.filter((p) => !players.value.includes(p));
});

function onCreate(item: string, index: number) {
  const newPlayerName = item.trim();
  if (newPlayerName === "") return;
  if (knownPlayers.value.includes(newPlayerName)) return;
  knownPlayers.value.push(newPlayerName);
  players.value[index] = newPlayerName;
}
const validPlayers = computed(() => {
  return players.value.filter((p) => p.trim() !== "");
});
function new301Game() {
  const gameId = createNew301(validPlayers.value);
  navigateTo(`/${gameId}`);
}
</script>

<template>
  <UModal
    title="Nouvelle partie de 301"
    description="Objectif : atteindre 0 points en partant de 301."
  >
    <UButton block size="xl">Nouvelle partie</UButton>

    <template #body>
      <div class="space-y-3">
        <div v-for="(_, i) in players" :key="i" class="flex gap-1.5">
          <USelectMenu
            v-model="players[i]"
            :items="options"
            :placeholder="'Joueur ' + (i + 1)"
            class="flex-1"
            create-item
            @create="onCreate($event, i)"
          />
          <UButton
            icon="i-lucide-x"
            color="error"
            square
            size="xl"
            @click="players.splice(i, 1)"
          />
        </div>
        <UButton
          icon="i-lucide-plus"
          variant="ghost"
          block
          @click="players.push('')"
          >Ajouter un joueur</UButton
        >
        <UButton
          icon="i-lucide-plus"
          block
          class="float-right"
          :disabled="validPlayers.length < 1"
          @click="new301Game"
        >
          Nouvelle partie
        </UButton>
      </div>
    </template>
  </UModal>
</template>
