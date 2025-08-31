<script lang="ts" setup>
import { whenever } from "@vueuse/core";

interface Props {
  playerName: string;
  isCurrentPlayer: boolean;
  table: CricketTable;
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
    class="border border-accented flex-1 max-w-3xs min-w-40 mx-auto pb-4 pt-2 px-4 relative rounded-lg text-center transition-colors"
    :class="
      isCurrentPlayer
        ? 'border bg-primary/10 border-primary/25 '
        : 'opacity-60 italic font-medium'
    "
  >
    <div class="font-bold text-xl">
      {{ playerName }}
    </div>
    <UBadge variant="outline" class="mb-1.5">
      {{ getAchievedThrows(table) }} / 21
    </UBadge>

    <div class="gap-1 grid grid-cols-2">
      <CricketScoreIconMobile
        label="Bull"
        :score="table.bull"
        class="col-span-2"
      />
      <CricketScoreIconMobile label="20" :score="table[20]" />
      <CricketScoreIconMobile label="19" :score="table[19]" />
      <CricketScoreIconMobile label="18" :score="table[18]" />
      <CricketScoreIconMobile label="17" :score="table[17]" />
      <CricketScoreIconMobile label="16" :score="table[16]" />
      <CricketScoreIconMobile label="15" :score="table[15]" />
    </div>
  </div>
</template>
