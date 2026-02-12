<script lang="ts" setup>
import confetti from "canvas-confetti";

interface Props {
  to: string;
  winner: { name: string } | null;
  rankings: { name: string }[];
}
const props = defineProps<Props>();
const emit = defineEmits<{ undoTurn: []; revenge: [] }>();

function fire(particleRatio: number, opts: confetti.Options) {
  confetti({
    origin: { y: 0.6 },
    ...opts,
    particleCount: Math.floor(200 * particleRatio),
  });
}

function triggerConfetti() {
  if (props.winner === null) return;

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });

  setTimeout(() => fire(0.25, { spread: 70 }), 200);
  setTimeout(() => fire(0.25, { spread: 70 }), 360);
  setTimeout(() => fire(0.65, { spread: 140, startVelocity: 55 }), 560);
}

watch(() => props.winner, triggerConfetti);

defineShortcuts({
  " ": () => triggerConfetti(),
});
</script>

<template>
  <div
    v-if="winner"
    class="absolute backdrop-blur-lg bg-default/80 flex flex-col font-bold inset-0 items-center justify-center p-8 z-10"
  >
    <div class="lg:text-6xl mb-3 text-4xl text-center">
      <span class="lg:text-6xl text-5xl">🥇</span> {{ winner.name }}
    </div>
    <div class="leading-relaxed lg:text-4xl max-w-sm mb-6 mx-auto text-2xl">
      <div v-for="(player, i) in rankings.slice(1)" :key="i" class="flex">
        <div
          class="flex items-center lg:min-w-16 min-w-12 relative"
          :class="i > 1 && 'text-2xl pl-2'"
        >
          {{ i === 0 ? "🥈" : i === 1 ? "🥉" : i + 2 }}
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
