<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { useRouteQuery } from "@vueuse/router";

const tab = useRouteQuery("tab", "0");
const items = ref<TabsItem[]>([
  {
    label: "Double Out",
    icon: "i-lucide-target",
    slot: "double-out",
  },
  {
    label: "Cricket",
    icon: "i-lucide-goal",
    slot: "cricket",
  },
  {
    label: "La Moitié",
    icon: "i-lucide-divide",
    slot: "halve-it",
  },
]);
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <UTabs v-model="tab" :items="items">
      <template #double-out>
        <div class="space-y-3">
          <p class="font-bold text-2xl">Double Out</p>

          <DoubleOutNewGame />
          <DoubleOutTable />
        </div>
      </template>

      <template #cricket>
        <div class="space-y-3">
          <p class="font-bold text-2xl">Cricket</p>

          <CricketNewGame />
          <CricketTable />
        </div>
      </template>

      <template #halve-it>
        <div class="space-y-3">
          <p class="font-bold text-2xl">La Moitié</p>

          <HalveItNewGame />
          <HalveItTable />
        </div>
      </template>
    </UTabs>
  </div>
</template>
