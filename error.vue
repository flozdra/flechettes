<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

function handleError(clearStorage?: boolean) {
  if (clearStorage) {
    localStorage.clear();
  }
  clearError({ redirect: "/" });
}
</script>

<template>
  <div
    class="flex items-center justify-center flex-col h-screen gap-3 text-xl p-6 text-center"
  >
    <template v-if="props.error.statusCode < 500">
      <AppLogo class="size-12 fill-current" />
      <p class="font-extrabold">{{ error.message }}</p>
      <UButton @click="handleError(false)">Retour à la page d'accueil</UButton>
    </template>

    <template v-if="props.error.statusCode === 500">
      <AppLogo class="size-12 fill-current" />
      <p class="font-extrabold">Une erreur est survenue</p>
      <p class="text-sm">{{ props.error }}</p>
      <UButton @click="handleError(false)">Retour à la page d'accueil</UButton>
      <p class="text-xs mt-6">
        Si l'erreur persiste, essayez de vider le stockage du navigateur :
      </p>
      <UButton
        color="warning"
        variant="soft"
        size="xs"
        @click="handleError(true)"
        >Vider le stockage et retourner à l'accueil</UButton
      >
      <UButton
        color="neutral"
        variant="soft"
        size="xs"
        icon="i-simple-icons-github"
        target="_blank"
        to="https://github.com/flozdra/flechettes/issues/new"
        >Signaler sur GitHub</UButton
      >
    </template>
  </div>
</template>
