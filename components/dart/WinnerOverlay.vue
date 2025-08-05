<script lang="ts" setup>
import confetti from "canvas-confetti";

interface Props {
  to: string;
  winner: { name: string } | null;
  rankings: { name: string }[];
}
const props = defineProps<Props>();
const emit = defineEmits<{ undoTurn: []; revenge: [] }>();

const soundEffects = useSoundEffects();

function fire(particleRatio: number, opts: confetti.Options) {
  confetti({
    origin: { y: 0.8 },
    ...opts,
    particleCount: Math.floor(200 * particleRatio),
  });
}
const isPlaying = ref(false);

function triggerConfetti() {
  if (props.winner === null || isPlaying.value) return;
  isPlaying.value = true;
  soundEffects.orchestralWin.play();

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });

  setTimeout(() => fire(0.25, { spread: 70 }), 500);
  setTimeout(() => fire(0.25, { spread: 70 }), 620);
  setTimeout(() => fire(0.25, { spread: 70 }), 740);
  setTimeout(() => fire(0.65, { spread: 140, startVelocity: 55 }), 860);

  setTimeout(() => fire(0.25, { spread: 70 }), 1500);
  setTimeout(() => fire(0.25, { spread: 70 }), 1620);
  setTimeout(() => fire(0.25, { spread: 70 }), 1740);
  setTimeout(() => fire(0.65, { spread: 140, startVelocity: 55 }), 1860);

  setTimeout(() => fire(0.25, { spread: 70 }), 2500);
  setTimeout(() => fire(0.25, { spread: 70 }), 2620);
  setTimeout(() => fire(0.25, { spread: 70 }), 2740);
  setTimeout(() => fire(0.65, { spread: 140, startVelocity: 55 }), 2860);

  setTimeout(() => fire(0.85, { spread: 150 }), 3500);
  setTimeout(() => fire(0.75, { spread: 200, decay: 0.92 }), 3920);
  setTimeout(() => (isPlaying.value = false), 4000);
}

watch(() => props.winner, triggerConfetti);

defineShortcuts({
  " ": () => triggerConfetti(),
});
</script>

<template>
  <div
    v-if="winner"
    class="absolute inset-0 z-10 p-12 bg-default/80 space-y-12 backdrop-blur-lg font-bold flex flex-col items-center justify-center"
  >
    <div class="text-center text-8xl">🏆 {{ winner.name }} a gagné ! 🏆</div>

    <div class="text-4xl leading-relaxed mx-auto max-w-sm">
      <div v-for="(player, i) in rankings" :key="i" class="flex">
        <div
          class="min-w-16 flex items-center relative"
          :class="i > 2 && 'text-3xl ml-2'"
        >
          {{ i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1 }}
        </div>
        {{ player.name }}
      </div>
    </div>

    <div
      class="flex flex-wrap gap-x-3 gap-y-1.5 items-center justify-center mb-24"
    >
      <UButton
        color="primary"
        icon="i-lucide-rotate-ccw"
        size="xl"
        @click="emit('revenge')"
      >
        Revanche
      </UButton>
      <UButton
        color="primary"
        variant="subtle"
        icon="i-lucide-home"
        size="xl"
        :to="to"
      >
        Retour au menu
      </UButton>
      <div class="basis-full" />
      <UButton
        color="error"
        icon="i-lucide-undo"
        size="xl"
        @click="emit('undoTurn')"
      >
        Annuler la dernière flèche
      </UButton>
    </div>
  </div>
</template>
