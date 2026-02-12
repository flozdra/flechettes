<script lang="ts" setup>
import { ref } from "vue";

const games = ref<DoubleOutGame[]>([]);

for (const key in localStorage) {
  if (key.startsWith("double-out")) {
    const game = reactive(useDoubleOut(key));
    games.value.push(game);
  }
}

games.value.sort((a, b) => b.state.createdAt - a.state.createdAt);

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
    games.value = games.value.filter((game) => game.state.id !== gameId);
    localStorage.removeItem(gameId);
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
        { accessorKey: 'initialScore', header: 'Type' },
        { accessorKey: 'players', header: 'Joueurs' },
        { accessorKey: 'round', header: 'Tour' },
        { accessorKey: 'winner', header: 'Gagnant' },
        { accessorKey: 'createdAt', header: 'Créé le' },
        { id: 'actions' },
      ]"
      @select="(_, row) => navigateTo('/double-out/' + row.original.state.id)"
    >
      <template #createdAt-cell="{ cell }">
        <span>{{ formatDate(cell.row.original.state.createdAt) }}</span>
      </template>
      <template #initialScore-cell="{ cell }">
        <UBadge
          :color="
            cell.row.original.state.initialScore === 301 ? 'primary' : 'warning'
          "
        >
          {{ cell.row.original.state.initialScore }}
        </UBadge>
      </template>
      <template #round-cell="{ cell }">
        {{ cell.row.original.round }}
      </template>
      <template #players-cell="{ cell }">
        <span class="flex gap-1">
          <template
            v-for="(player, i) in cell.row.original.state.players"
            :key="i"
          >
            <template v-if="i > 0"> - </template>
            {{ player }}
          </template>
        </span>
      </template>
      <template #winner-cell="{ cell }">
        <span>
          {{
            cell.row.original.winner !== null
              ? "🏆 " + cell.row.original.winner.name
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
                label: 'Revanche',
                onSelect: () => cell.row.original.revenge(),
              },
              {
                label: 'Supprimer',
                onSelect: () => deleteGame(cell.row.original.state.id),
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

    <div class="border-default border-t flex justify-center pt-4">
      <UPagination
        v-model:page="page"
        :items-per-page="perPage"
        :total="games.length"
      />
    </div>
  </div>
</template>
