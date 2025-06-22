<script setup>
const shortcuts = [
  { key: "Esc", action: "Revenir au tour précédent" },
  { key: "⌫", action: "Annuler la dernière flèche" },
  { key: "Entrée", action: "Confirmer les flèches" },
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
          <div class="grid grid-cols-8 items-center gap-3">
            <UKbd size="lg">{{ shortcut.key }}</UKbd>
            <span class="col-span-7">{{ shortcut.action }}</span>
          </div>
        </template>
      </div>
    </template>
  </UModal>
</template>
