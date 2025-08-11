<script lang="ts" setup>
const { soundBoard, keys, playAudio } = useSoundBoard();
</script>

<template>
  <UModal title="SoundBoard" description="Gérer les sons de l'application">
    <UButton
      icon="i-lucide-audio-lines"
      color="neutral"
      variant="ghost"
      size="xl"
    />
    <template #body>
      <div class="space-y-3">
        <p class="text-sm">
          Chaque son est associé à une touche du pavé numérique.
        </p>
        <div v-for="key in keys" :key="key" class="flex gap-1 items-center">
          <UInput
            v-model="soundBoard[key]"
            placeholder="Entrer l'URL d'un son"
            :ui="{ leading: 'pl-2', trailing: 'pe-1.5' }"
            class="w-full"
          >
            <template #leading>
              <UKbd>{{ key }}</UKbd>
            </template>
            <template #trailing>
              <UButton
                v-if="soundBoard[key]?.length"
                color="neutral"
                variant="link"
                icon="i-lucide-circle-x"
                @click="soundBoard[key] = ''"
              />
            </template>
          </UInput>
          <UButton
            color="neutral"
            variant="ghost"
            size="xl"
            icon="i-lucide-play"
            :disabled="!soundBoard[key]"
            @click="playAudio(key)"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
