<script lang="ts" setup>
interface Props {
  player: { name: string; score: number };
  isCurrentPlayer: boolean;
}
defineProps<Props>();
</script>

<template>
  <div
    class="border border-accented p-3 rounded-lg space-y-3 text-3xl"
    :class="{
      'opacity-60 italic': !isCurrentPlayer,
      'bg-primary/10 border-primary/50 ': isCurrentPlayer,
    }"
  >
    <div class="flex items-center justify-between">
      <span>{{ player.name }}</span>
      <span>{{ player.score }}</span>
    </div>
  </div>
</template>
