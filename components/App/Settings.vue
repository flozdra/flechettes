<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";

const knownPlayers = useLocalStorage<string[]>("known-players", []);
</script>

<template>
  <UModal
    title="Paramètres"
    description="Gérer les joueurs enregistrés dans l'application"
  >
    <UButton
      icon="i-lucide-settings"
      color="neutral"
      variant="ghost"
      size="xl"
    />
    <template #body>
      <div class="space-y-3">
        <UTable
          :data="knownPlayers"
          :columns="[
            { accessorKey: 'name', header: 'Joueurs enregistrés' },
            { id: 'actions' },
          ]"
          class="max-h-[360px]"
          :ui="{ th: 'p-2', td: 'p-2' }"
          sticky
        >
          <template #name-cell="{ cell }">{{ cell.row.original }}</template>
          <template #actions-cell="{ cell }">
            <div class="text-right">
              <UDropdownMenu
                :content="{ align: 'end' }"
                :items="[
                  {
                    label: 'Supprimer',
                    onSelect: () => {
                      knownPlayers = knownPlayers.filter(
                        (p) => p !== cell.row.original
                      );
                    },
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
      </div>
    </template>
  </UModal>
</template>
