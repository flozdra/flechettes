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
]);
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <UTabs v-model="tab" :items="items">
      <template #double-out>
        <div class="space-y-3">
          <p class="text-2xl font-bold">Double Out</p>

          <DoubleOutNewGame />
          <DoubleOutTable />
        </div>
      </template>

      <template #cricket>
        <div class="space-y-3">
          <p class="text-2xl font-bold">Cricket</p>

          <CricketNewGame />
          <CricketTable />
        </div>
      </template>
    </UTabs>
  </div>
</template>
