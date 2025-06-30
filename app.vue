<script setup lang="ts">
import { fr } from "@nuxt/ui/locale";
</script>

<template>
  <UApp :locale="fr">
    <div class="h-screen">
      <header class="border-b flex items-center p-3">
        <NuxtLink to="/" class="inline-flex gap-2 text-2xl items-center">
          <AppLogo class="w-8 h-8 fill-current" />
          <span class="font-extrabold">Fléchettes</span>
        </NuxtLink>
        <div class="grow" />
        <AppColorModeButton />
        <AppSoundBoard />
        <AppSettings />
        <UButton
          color="neutral"
          variant="ghost"
          size="xl"
          to="https://github.com/flozdra/flechettes"
          target="_blank"
          icon="i-simple-icons-github"
        />
      </header>

      <main class="p-3">
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>
