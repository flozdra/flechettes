<script lang="ts" setup>
interface Props {
  canUndo: boolean;
}
defineProps<Props>();

const emits = defineEmits<{ undo: []; confirmThrows: [] }>();
</script>

<template>
  <div class="flex gap-3">
    <div class="grow" />
    <UButton
      color="error"
      icon="i-lucide-undo"
      size="xl"
      :hidden="!canUndo"
      @click="emits('undo')"
    >
      Annuler
    </UButton>
    <UButton
      color="success"
      trailing-icon="i-lucide-check"
      size="xl"
      @click="emits('confirmThrows')"
    >
      Confirmer
    </UButton>
  </div>
</template>
