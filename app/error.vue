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
    class="flex flex-col gap-3 h-screen items-center justify-center p-6 text-center text-xl"
  >
    <template v-if="props.error.status === 500">
      <AppLogo class="fill-current size-12" />
      <p class="font-extrabold">Une erreur est survenue</p>
      <p class="text-sm">{{ props.error }}</p>
      <UButton @click="handleError(false)">Retour à la page d'accueil</UButton>
      <p class="mt-6 text-xs">
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

    <template v-else>
      <AppLogo class="fill-current size-12" />
      <p class="font-extrabold">{{ props.error.message }}</p>
      <UButton @click="handleError(false)">Retour à la page d'accueil</UButton>
    </template>
  </div>
</template>
