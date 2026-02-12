<script lang="ts" setup>
defineProps<{ label: string; score: number }>();
</script>

<template>
  <div class="w-8">
    <div>{{ label }}</div>
    <div>
      <UBadge v-if="score === 0" size="xl" variant="outline" color="neutral">
        0
      </UBadge>
      <UBadge
        v-else-if="score === 1"
        size="xl"
        variant="subtle"
        color="warning"
      >
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
    </div>
  </div>
</template>
