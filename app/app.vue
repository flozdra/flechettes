<script setup lang="ts">
import { fr } from "@nuxt/ui/locale";
</script>

<template>
  <UApp :locale="fr">
    <div class="h-screen">
      <header class="border-b border-muted flex items-center p-3">
        <NuxtLink to="/" class="gap-2 inline-flex items-center text-2xl">
          <AppLogo class="fill-current size-8" />
          <span class="font-extrabold">Fléchettes</span>
        </NuxtLink>
        <div class="grow" />
        <UColorModeButton />
        <AppSoundboard />
        <AppSettings />
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/flozdra/flechettes"
          target="_blank"
          icon="i-simple-icons-github"
        />
      </header>

      <main>
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>
