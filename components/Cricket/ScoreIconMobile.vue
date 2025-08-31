<script lang="ts" setup>
defineProps<{ label: string; score: number }>();
</script>

<template>
  <UBadge
    v-if="score === 0"
    size="lg"
    variant="outline"
    color="neutral"
    class="justify-center"
  >
    {{ label }} · 0
  </UBadge>
  <UBadge
    v-else-if="score === 1"
    size="lg"
    variant="subtle"
    color="warning"
    class="justify-center"
  >
    {{ label }} · 1
  </UBadge>
  <UBadge
    v-else-if="score === 2"
    size="lg"
    variant="subtle"
    color="secondary"
    class="justify-center"
  >
    {{ label }} · 2
  </UBadge>
  <UBadge
    v-else
    size="lg"
    variant="solid"
    color="primary"
    class="justify-center"
  >
    {{ label }} · 3
  </UBadge>
</template>
