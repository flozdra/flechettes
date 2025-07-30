<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";

const knownPlayers = useLocalStorage<string[]>("known-players", []);
const settings = useSettings();

const shortcuts = [
  { key: "Esc", action: "Revenir au tour précédent" },
  { key: "⌫", action: "Annuler la dernière flèche" },
  { key: "Entrée", action: "Confirmer les flèches" },
  { key: "0 – 9", action: "SoundBoard" },
];
</script>

<template>
  <UModal
    title="Paramètres"
    description="Gérer les paramètres de l'application."
  >
    <UButton
      icon="i-lucide-settings"
      color="neutral"
      variant="ghost"
      size="xl"
    />
    <template #body>
      <div class="space-y-6 text-sm">
        <div>
          <p class="font-semibold text-highlighted mb-3">Préférences</p>
          <div class="space-y-3">
            <USwitch
              v-model="settings.autoConfirmThrows"
              label="Confirmation automatique des lancés"
            />
            <USwitch
              v-model="settings.highlightNumbers"
              label="Mise en surbrillance des numéros"
            />
          </div>
        </div>

        <UTable
          :data="knownPlayers"
          :columns="[
            { accessorKey: 'name', header: 'Joueurs enregistrés' },
            { id: 'actions' },
          ]"
          class="max-h-[360px]"
          :ui="{ th: 'px-0 py-1', td: 'px-0 py-1' }"
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

        <div>
          <p class="font-semibold text-highlighted mb-3">Raccourcis clavier</p>
          <div class="grid grid-cols-2 gap-2">
            <template v-for="shortcut in shortcuts" :key="shortcut.key">
              <div class="flex items-center gap-1.5">
                <UKbd class="min-w-12">{{ shortcut.key }}</UKbd>
                <span class="text-xs">{{ shortcut.action }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
