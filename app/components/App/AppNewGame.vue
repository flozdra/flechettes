<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";

const players = ref<string[]>([]);
const game = ref<"double-out" | "cricket" | "halve-it">("double-out");
const score = ref<301 | 501>(301);
const endWithDouble = ref<boolean>(false);

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

function createNewGame() {
  if (game.value === "cricket") {
    createNewCricket(players.value);
  } else if (game.value === "halve-it") {
    createNewHalveIt(players.value);
  } else if (game.value === "double-out") {
    createNewDoubleOut(score.value, endWithDouble.value, players.value);
  }
}
</script>

<template>
  <UModal
    title="Nouvelle partie de fléchettes"
    description="Sélectionnez le mode de jeu et les joueurs."
  >
    <UButton block class="p-3 text-xl">Nouvelle partie</UButton>

    <template #body>
      <div class="space-y-3">
        <UFormField label="Joueurs">
          <USelectMenu
            v-model="players"
            v-model:search-term="search"
            autofocus
            :items="knownPlayers"
            placeholder="Sélectionnez les joueurs"
            multiple
            class="w-full"
            size="xl"
            create-item
            clear
            @create="createNewPlayer"
          />
        </UFormField>

        <UFormField label="Mode de jeu">
          <URadioGroup
            v-model="game"
            variant="table"
            orientation="horizontal"
            :items="[
              { label: 'Cricket', value: 'cricket' },
              { label: 'Double Out', value: 'double-out' },
              { label: 'Halve It', value: 'halve-it' },
            ]"
            size="lg"
            :ui="{ item: 'grow text-center' }"
          />
        </UFormField>

        <!-- Cricket -->
        <template v-if="game === 'cricket'">
          <p class="text-muted text-sm">
            Fermez les numéros de 15 à 20 et le bullseye en les touchant trois
            fois chacun.
          </p>
        </template>

        <!-- Double Out options -->
        <template v-else-if="game === 'double-out'">
          <p class="text-muted text-sm">
            Atteignez exactement 0 points en partant de 301 ou 501 points.
          </p>
          <UFormField>
            <URadioGroup
              v-model="score"
              orientation="horizontal"
              variant="table"
              :items="[
                { label: '301', value: 301 },
                { label: '501', value: 501 },
              ]"
              :ui="{ item: 'grow text-center' }"
            />
          </UFormField>

          <UFormField>
            <UCheckbox
              v-model="endWithDouble"
              label="Finir la partie avec un double"
              size="lg"
            />
          </UFormField>
        </template>

        <!-- Halve It -->
        <template v-else-if="game === 'halve-it'">
          <p class="text-muted text-sm">
            Marquez le plus de points possible sur une série de sections
            prédéfinies.<br />
            Si vous manquez la section sur un tour, votre score est divisé par
            deux.
          </p>
        </template>

        <UButton
          icon="i-lucide-plus"
          block
          size="lg"
          :disabled="players.length === 0"
          @click="createNewGame"
        >
          Nouvelle partie
        </UButton>
      </div>
    </template>
  </UModal>
</template>
