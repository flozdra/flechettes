<script lang="ts" setup>
interface Props {
  playerName: string;
  isCurrentPlayer: boolean;
  table: CricketTable;
}
defineProps<Props>();
</script>

<template>
  <div
    class="border border-accented pb-4 pt-2 px-4 relative rounded-lg space-y-3 text-center"
    :class="
      isCurrentPlayer
        ? 'border bg-primary/10 border-primary/25 '
        : 'opacity-60 italic font-medium'
    "
  >
    <div class="font-bold text-3xl">
      {{ playerName }}
    </div>
    <UBadge variant="outline" class="absolute right-2 top-2">
      {{ getAchievedThrows(table) }} / 21
    </UBadge>

    <div class="flex font-bold justify-between rounded-lg text-lg">
      <CricketScoreIcon label="20" :score="table[20]" />
      <CricketScoreIcon label="19" :score="table[19]" />
      <CricketScoreIcon label="18" :score="table[18]" />
      <CricketScoreIcon label="17" :score="table[17]" />
      <CricketScoreIcon label="16" :score="table[16]" />
      <CricketScoreIcon label="15" :score="table[15]" />
      <CricketScoreIcon label="Bull" :score="table.bull" />
    </div>

    <UProgress
      class="mt-3"
      :model-value="getAchievedThrows(table)"
      :max="21"
      color="primary"
    />
  </div>
</template>
