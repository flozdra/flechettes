<script lang="ts" setup>
import { ref } from "vue";

const games = ref<(DoubleOutGame | CricketGame | HalveItGame)[]>([]);

let doubleOutGames = 0;
let cricketGames = 0;
let halveItGames = 0;

// Load games from localStorage
for (const key in localStorage) {
  if (key.startsWith("double-out")) {
    const game = reactive(useDoubleOut(key));
    games.value.push(game);
    doubleOutGames++;
  }
  if (key.startsWith("cricket")) {
    const game = reactive(useCricket(key));
    games.value.push(game);
    cricketGames++;
  }
  if (key.startsWith("halve-it")) {
    const game = reactive(useHalveIt(key));
    games.value.push(game);
    halveItGames++;
  }
}

const totalGames = computed(() => games.value.length);
const totalGames30Days = computed(
  () =>
    games.value.filter(
      (g) => g.state.createdAt >= Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).length,
);

const favoriteGame = computed(() => {
  if (totalGames.value === 0) {
    return { name: "N/A", count: 0 };
  }
  if (doubleOutGames >= cricketGames && doubleOutGames >= halveItGames) {
    return { name: "Double Out", count: doubleOutGames };
  } else if (cricketGames >= doubleOutGames && cricketGames >= halveItGames) {
    return { name: "Cricket", count: cricketGames };
  } else {
    return { name: "Halve It", count: halveItGames };
  }
});
const bestPlayers = computed(() => {
  return games.value
    .reduce(
      (acc, game) => {
        // Count games for each player
        for (const player of game.players) {
          const existing = acc.find((p) => p.name === player.name);
          if (!existing) {
            acc.push({ name: player.name, wins: 0, games: 1 });
          } else {
            existing.games++;
          }
        }
        // If there's a winner, count the win
        if (game.winner) {
          const winner = acc.find((p) => p.name === game.winner!.name);
          winner!.wins++;
        }
        return acc;
      },
      [] as { name: string; wins: number; games: number }[],
    )
    .sort((a, b) => b.wins / b.games - a.wins / a.games);
});

function ratio(wins: number, games: number) {
  return games > 0 ? ((wins / games) * 100).toFixed(1) : "0.0";
}
</script>

<template>
  <div class="gap-3 grid lg:grid-cols-4 md:grid-cols-2">
    <div class="p-3 ring ring-default rounded-lg">
      <p class="text-xs">Total de parties jouées</p>
      <p class="font-bold text-2xl">{{ totalGames }}</p>
      <p class="text-muted text-xs">
        {{ totalGames30Days }} sur les 30 derniers jours
      </p>
    </div>
    <div class="p-3 ring ring-default rounded-lg">
      <p class="text-xs">Mode de jeu préféré</p>
      <p class="font-bold text-2xl">{{ favoriteGame.name }}</p>
      <p class="text-muted text-xs">{{ favoriteGame.count }} parties jouées</p>
    </div>
    <div class="p-3 ring ring-default rounded-lg">
      <p class="text-xs">Joueur n°1</p>
      <p class="font-bold text-2xl">{{ bestPlayers[0]?.name || "N/A" }}</p>
      <p class="text-muted text-xs">
        {{ bestPlayers[0]?.wins || 0 }} victoires ·
        {{ bestPlayers[0]?.games || 0 }} parties ·
        {{
          bestPlayers[0]
            ? ratio(bestPlayers[0].wins, bestPlayers[0].games)
            : "0.0"
        }}%
      </p>
    </div>
    <div class="p-3 ring ring-default rounded-lg">
      <p class="text-xs">Joueur n°2</p>
      <p class="font-bold text-2xl">{{ bestPlayers[1]?.name || "N/A" }}</p>
      <p class="text-muted text-xs">
        {{ bestPlayers[1]?.wins || 0 }} victoires ·
        {{ bestPlayers[1]?.games || 0 }} parties ·
        {{
          bestPlayers[1]
            ? ratio(bestPlayers[1].wins, bestPlayers[1].games)
            : "0.0"
        }}%
      </p>
    </div>
  </div>
</template>
