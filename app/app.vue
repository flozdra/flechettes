<script setup lang="ts">
import { fr } from "@nuxt/ui/locale";
</script>

<template>
  <UApp :locale="fr">
    <div class="h-screen">
      <header class="border-b border-muted flex h-16 items-center p-3">
        <NuxtLink to="/" class="gap-2 inline-flex items-center">
          <AppLogo class="-my-1 fill-current h-10" />
          <span class="font-extrabold text-3xl">Fléchettes</span>
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
