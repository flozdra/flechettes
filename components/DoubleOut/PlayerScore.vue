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
    class="border border-accented p-3 rounded-lg space-y-3 text-3xl"
    :class="{
      'opacity-60 italic': !isCurrentPlayer,
      'bg-primary/10 border-primary/50': isCurrentPlayer && !isInvalid,
      'border-error/50 bg-error/10': isInvalid,
    }"
  >
    <div class="flex items-center justify-between">
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
