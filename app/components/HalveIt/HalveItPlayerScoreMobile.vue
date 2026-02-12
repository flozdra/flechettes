<script lang="ts" setup>
import { whenever } from "@vueuse/core";

interface Props {
  player: { name: string; score: number };
  isCurrentPlayer: boolean;
}
const props = defineProps<Props>();

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
      'bg-primary/10 border-primary/50 ': isCurrentPlayer,
    }"
  >
    <p class="font-bold text-2xl">{{ player.score }}</p>
    <p>{{ player.name }}</p>
  </div>
</template>
