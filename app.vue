<script setup lang="ts">
import ColorModeButton from "~/components/ui/ColorModeButton.vue";
</script>

<template>
  <UApp>
    <div class="h-screen">
      <header class="h-12 border-b flex items-center p-3">
        Fléchettes
        <div class="grow" />
        <ColorModeButton />
      </header>

      <main class="p-3">
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>
