<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";

const knownPlayers = useLocalStorage<string[]>("known-players", []);

const players = ref<string[]>(["", "", "", ""]);
const score = ref<301 | 501>(301);
const endWithDouble = ref<boolean>(false);

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

function createNewGame() {
  createNewDoubleOut(score.value, endWithDouble.value, validPlayers.value);
}
</script>

<template>
  <UModal
    title="Nouvelle partie de Double Out"
    description="Objectif : atteindre 0 points en partant de 301 ou 501 points."
  >
    <UButton block size="xl">Nouvelle partie</UButton>

    <template #body>
      <div class="space-y-3">
        <URadioGroup
          v-model="score"
          orientation="horizontal"
          variant="table"
          :items="[
            { label: '301', value: 301 },
            { label: '501', value: 501 },
          ]"
          :ui="{ item: 'grow text-center text-lg py-2 items-center' }"
        />

        <UCheckbox
          v-model="endWithDouble"
          label="Finir la partie avec un double"
        />

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
        >
          Ajouter un joueur
        </UButton>
        <UButton
          icon="i-lucide-plus"
          block
          :disabled="validPlayers.length < 1"
          @click="createNewGame"
        >
          Nouvelle partie
        </UButton>
      </div>
    </template>
  </UModal>
</template>
