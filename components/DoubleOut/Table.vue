<script lang="ts" setup>
import { ref } from "vue";

const games = ref<DoubleOutGame[]>([]);

for (const i in localStorage) {
  if (i.startsWith("double-out-")) {
    games.value.push(
      JSON.parse(localStorage.getItem(i) as string) as DoubleOutGame
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

function deleteGame(gameId: string) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette partie ?")) {
    localStorage.removeItem(gameId);
    games.value = games.value.filter((game) => game.id !== gameId);
  }
}

/**
 * Pagination
 */
const page = ref(1);
const perPage = 10;
const rows = computed(() => {
  return games.value.slice((page.value - 1) * perPage, page.value * perPage);
});
</script>

<template>
  <div>
    <UTable
      :data="rows"
      :columns="[
        { accessorKey: 'score', header: 'Type' },
        { accessorKey: 'players', header: 'Joueurs' },
        { accessorKey: 'round', header: 'Round' },
        { accessorKey: 'winnerIndex', header: 'Gagnant' },
        { accessorKey: 'createdAt', header: 'Créé le' },
        { id: 'actions' },
      ]"
      @select="(row) => navigateTo('/double-out/' + row.original.id)"
    >
      <template #createdAt-cell="{ cell }">
        <span>{{ formatDate(cell.getValue() as number) }}</span>
      </template>
      <template #score-cell="{ cell }">
        <UBadge :color="cell.getValue() === 301 ? 'primary' : 'warning'">
          {{ cell.getValue() as DoubleOutGame["score"] }}
        </UBadge>
      </template>
      <template #round-cell="{ cell }">
        {{ cell.getValue() as DoubleOutGame["round"] }}
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
                (games[cell.row.index].players as DoubleOutGame["players"])[
                  cell.getValue() as number
                ].name
              : "-"
          }}
        </span>
      </template>
      <template #actions-cell="{ cell }">
        <div class="text-right">
          <UDropdownMenu
            :content="{ align: 'end' }"
            :items="[
              {
                label: 'Supprimer',
                onSelect: () => deleteGame(cell.row.original.id),
              },
            ]"
          >
            <UButton
              icon="i-lucide-ellipsis-vertical"
              color="neutral"
              variant="ghost"
              class="ml-auto"
            />
          </UDropdownMenu>
        </div>
      </template>
    </UTable>

    <div class="flex justify-center border-t border-default pt-4">
      <UPagination
        v-model:page="page"
        :items-per-page="perPage"
        :total="games.length"
      />
    </div>
  </div>
</template>
