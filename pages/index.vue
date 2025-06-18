<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const games301 = use301Games();

const items = ref<TabsItem[]>([
  {
    label: "Le 301",
    icon: "i-lucide-target",
    slot: "301",
  },
  {
    label: "Cricket",
    icon: "i-lucide-goal",
    slot: "cricket",
  },
]);

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
  <div class="max-w-4xl mx-auto">
    <UTabs :items="items">
      <template #301>
        <div class="space-y-3">
          <p class="text-2xl font-bold">Le 301</p>

          <UTable
            :data="games301"
            :columns="[
              { accessorKey: 'createdAt', header: 'Créé le' },
              { accessorKey: 'players', header: 'Joueurs' },
              { accessorKey: 'winnerIndex', header: 'Gagnant' },
            ]"
            @select="(row) => navigateTo('/' + row.original.id)"
          >
            <template #createdAt-cell="{ cell }">
              <span>{{ formatDate(cell.getValue() as number) }}</span>
            </template>
            <template #players-cell="{ cell }">
              <span class="flex gap-1">
                <template
                  v-for="(player, i) in cell.getValue() as GameState['players']"
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
                      (
                        games301[cell.row.index].players as GameState["players"]
                      )[cell.getValue() as number].name
                    : "-"
                }}
              </span>
            </template>
          </UTable>

          <Create301Dialog />
        </div>
      </template>

      <template #cricket>En cours de création...</template>
    </UTabs>
  </div>
</template>
