<script setup lang="ts">
import { fr } from "@nuxt/ui/locale";
</script>

<template>
  <UApp :locale="fr">
    <div class="h-screen">
      <header class="border-b flex items-center p-3">
        <NuxtLink to="/" class="inline-flex gap-2 text-2xl items-center">
          <UIcon name="i-lucide-goal" class="text-3xl" />
          <span class="font-extrabold">Fléchettes</span>
        </NuxtLink>
        <div class="grow" />
        <AppColorModeButton />
        <AppShortcutsHelp />
        <AppSettings />
      </header>

      <main class="p-3">
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>
