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
    class="border border-accented flex-1 p-1 rounded text-center"
    :class="{
      'opacity-60 italic font-medium': !isCurrentPlayer,
      'bg-primary/10 border-primary/50 ': isCurrentPlayer && !isInvalid,
      'border-error/50 bg-error/10': isInvalid,
    }"
  >
    <p class="font-bold text-2xl" :class="{ 'text-error': isInvalid }">
      {{ player.score }}
    </p>
    <p>{{ player.name }}</p>
  </div>
</template>
