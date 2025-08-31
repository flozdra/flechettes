<script lang="ts" setup>
import { whenever } from "@vueuse/core";

interface Props {
  player: { name: string; score: number };
  isCurrentPlayer: boolean;
  invalidTurn: boolean;
  initialScore: number;
}
const props = defineProps<Props>();

const isInvalid = computed(() => props.invalidTurn && props.isCurrentPlayer);

/**
 * Smooth scroll to the active player
 */
const div = ref<HTMLElement | null>(null);
function scrollToElement() {
  if (div.value) {
    div.value.scrollIntoView({ behavior: "smooth", inline: "center" });
  }
}
onMounted(() => {
  whenever(() => props.isCurrentPlayer, scrollToElement, { immediate: true });
});
</script>

<template>
  <div
    ref="div"
    class="border border-accented flex-1 min-w-20 p-1 rounded text-center transition-colors"
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
