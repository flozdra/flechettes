<script lang="ts" setup>
import { ref } from "vue";

const games = ref<CricketGame[]>([]);

for (const i in localStorage) {
  if (i.startsWith("cricket-")) {
    games.value.push(
      JSON.parse(localStorage.getItem(i) as string) as CricketGame
    );
  }
}

games.value.sort((a, b) => b.createdAt - a.createdAt);

function formatDate(createdAt: number) {
  return new Date(createdAt).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
}
</script>

<template>
  <UTable
    :data="games"
    :columns="[
      { accessorKey: 'players', header: 'Joueurs' },
      { accessorKey: 'round', header: 'Round' },
      { accessorKey: 'winnerIndex', header: 'Gagnant' },
      { accessorKey: 'createdAt', header: 'Créé le' },
    ]"
    @select="(row) => navigateTo('/cricket/' + row.original.id)"
  >
    <template #createdAt-cell="{ cell }">
      <span>{{ formatDate(cell.getValue() as number) }}</span>
    </template>
    <template #round-cell="{ cell }">
      {{ cell.getValue() as CricketGame["round"] }}
    </template>
    <template #players-cell="{ cell }">
      <span class="flex gap-1">
        <template
          v-for="(player, i) in cell.getValue() as DoubleOutGame['players']"
          :key="i"
        >
          <template v-if="i > 0"> - </template>
          {{ player.name }}
        </template>
      </span>
    </template>
    <template #winnerIndex-cell="{ cell }">
      <span>
        {{
          (cell.getValue() as number) !== null
            ? "🏆 " +
              (games[cell.row.index].players as CricketGame["players"])[
                cell.getValue() as number
              ].name
            : "-"
        }}
      </span>
    </template>
  </UTable>
</template>
