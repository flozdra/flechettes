<script setup lang="ts">
import { fr } from "@nuxt/ui/locale";
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Jeux",
    to: "/",
    active: route.name === "index",
  },
  {
    label: "Entrainement",
    to: "/training",
    active: route.name === "training",
  },
]);
</script>

<template>
  <UApp :locale="fr">
    <UHeader>
      <template #title>
        <div to="/" class="flex gap-2 items-center">
          <AppLogo class="-my-1 fill-current h-10" />
          <span class="font-extrabold text-3xl">Fléchettes</span>
        </div>
      </template>

      <UNavigationMenu :items="items" />

      <template #body>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>

      <template #right>
        <UColorModeButton />
        <AppSoundboard />
        <AppSettings />
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/flozdra/flechettes"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>
  </UApp>
</template>
