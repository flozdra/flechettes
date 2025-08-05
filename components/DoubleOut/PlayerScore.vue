<script lang="ts" setup>
interface Props {
  player: { name: string; score: number };
  isCurrentPlayer: boolean;
  invalidTurn: boolean;
  initialScore: number;
}
const props = defineProps<Props>();

const isInvalid = computed(() => props.invalidTurn && props.isCurrentPlayer);
</script>

<template>
  <div
    class="p-3 rounded-lg text-4xl font-bold border space-y-3 border-accented"
    :class="{
      'opacity-60 italic font-medium': !isCurrentPlayer,
      'bg-primary/10 border-primary/50 ': isCurrentPlayer && !isInvalid,
      'border-error/50 bg-error/10': isInvalid,
    }"
  >
    <div class="flex items-center justify-between score">
      <span>{{ player.name }}</span>
      <span :class="{ 'text-error': isInvalid }">{{ player.score }}</span>
    </div>
    <UProgress
      :model-value="initialScore - Math.max(player.score, 0)"
      :max="initialScore"
      :color="isInvalid ? 'error' : 'primary'"
    />
  </div>
</template>
