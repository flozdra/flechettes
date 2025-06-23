<script setup>
const shortcuts = [
  { key: "Esc", action: "Revenir au tour précédent" },
  { key: "⌫", action: "Annuler la dernière flèche" },
  { key: "Entrée", action: "Confirmer les flèches" },
  { key: "Ctrl + 1", action: "Son buzzer" },
  { key: "Ctrl + 2", action: "Son pouet" },
  { key: "Ctrl + 3", action: "Son trompette" },
  { key: "Ctrl + 4", action: "Son wow" },
];
</script>

<template>
  <UModal
    title="Raccourcis clavier"
    description="Pour naviguer rapidement dans l'application."
  >
    <UButton icon="i-lucide-info" color="neutral" variant="ghost" size="xl" />
    <template #body>
      <div class="space-y-3">
        <template v-for="shortcut in shortcuts" :key="shortcut.key">
          <div class="grid grid-cols-7 items-center gap-3">
            <UKbd size="lg">{{ shortcut.key }}</UKbd>
            <span class="col-span-6">{{ shortcut.action }}</span>
          </div>
        </template>
      </div>
    </template>
  </UModal>
</template>
