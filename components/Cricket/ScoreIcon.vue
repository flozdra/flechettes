<script lang="ts" setup>
defineProps<{ score: number }>();
</script>

<template>
  <span class="">
    <UBadge v-if="score === 0" size="xl" variant="outline" color="neutral">
      0
    </UBadge>
    <UBadge v-else-if="score === 1" size="xl" variant="subtle" color="warning">
      1
    </UBadge>
    <UBadge
      v-else-if="score === 2"
      size="xl"
      variant="subtle"
      color="secondary"
    >
      2
    </UBadge>
    <UBadge v-else size="xl" variant="solid" color="primary">3</UBadge>
  </span>
</template>
