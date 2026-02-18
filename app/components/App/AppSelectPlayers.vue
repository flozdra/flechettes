<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";

const players = defineModel<string[]>({ required: true });
const knownPlayers = useLocalStorage<string[]>("known-players", []);
const search = ref("");

function createNewPlayer(player: string) {
  const playerName = player.trim();
  if (playerName === "") return;
  if (knownPlayers.value.includes(playerName)) return;
  knownPlayers.value.push(playerName);
  players.value.push(playerName);
  search.value = "";
}
</script>

<template>
  <USelectMenu
    v-model="players"
    v-model:search-term="search"
    :items="knownPlayers"
    placeholder="Sélectionnez les joueurs"
    multiple
    class="w-full"
    size="xl"
    create-item
    clear
    @create="createNewPlayer"
  />
</template>
