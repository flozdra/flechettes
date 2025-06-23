<script setup lang="ts">
import { fr } from "@nuxt/ui/locale";

useSeoMeta({
  title: "Fléchettes",
  ogTitle: "Fléchettes",
  ogType: "website",
  ogUrl: "https://flechettes.flozdra.dev/",
  description: "Record your dart throws from anywhere.",
  ogDescription: "Record your dart throws from anywhere.",
  ogImage: "/og-image.png",
  twitterCard: "summary_large_image",
  twitterTitle: "Fléchettes",
  twitterDescription: "Record your dart throws from anywhere.",
  twitterImage: "/og-image.png",
});
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
