<script lang="ts" setup>
interface Props {
  canUndo: boolean;
  currentThrows: DartThrowRecord[];
  invalidTurn?: boolean;
  showScore?: boolean;
  winningCombination?: DartThrow[];
}
const props = defineProps<Props>();
const emits = defineEmits<{ undo: []; confirmThrows: [] }>();

const currentThrowsScore = computed(() =>
  props.currentThrows.reduce((sum, record) => sum + record.dartThrow.score, 0)
);

/*
|--------------------------------------------------------------------------
| Auto-confirm throws
|--------------------------------------------------------------------------
*/
const settings = useSettings();
const timeout = ref<NodeJS.Timeout | null>(null);

watch(
  () => props.currentThrows,
  (newValue, oldValue) => {
    // Clear any existing timeout
    if (timeout.value) {
      clearTimeout(timeout.value);
      timeout.value = null;
    }

    if (
      oldValue.length === 2 &&
      newValue.length === 3 &&
      settings.value.autoConfirmThrows
    ) {
      // Starts a timeout to auto-confirm throws after a 1500ms
      timeout.value = setTimeout(() => {
        emits("confirmThrows");
        timeout.value = null;
      }, 1500);
    }
  }
);
</script>

<template>
  <div
    class="border border-muted duration-500 overflow-hidden p-3 relative rounded-2xl transition-colors whitespace-nowrap"
  >
    <div
      class="grid mb-3 text-2xl"
      :class="showScore ? 'grid-cols-4' : 'grid-cols-3'"
    >
      <div v-for="i in 3" :key="i" class="text-center">
        <span
          v-if="currentThrows[i - 1]"
          class="font-bold"
          :class="invalidTurn && 'text-error'"
        >
          {{ currentThrows[i - 1].dartThrow.id }}
        </span>
        <span
          v-else-if="winningCombination?.[i - 1 - currentThrows.length]"
          class="italic opacity-50"
        >
          {{ winningCombination[i - 1 - currentThrows.length].id }}
        </span>
        <span v-else>·</span>
      </div>

      <UBadge
        v-if="showScore"
        class="-my-1 font-bold justify-center px-3 py-1 rounded-lg text-2xl"
        variant="subtle"
        :color="invalidTurn ? 'error' : 'neutral'"
      >
        {{ currentThrowsScore }}
      </UBadge>
    </div>

    <div class="gap-1.5 grid grid-cols-2">
      <UButton
        :disabled="!canUndo"
        color="error"
        icon="i-lucide-undo"
        size="xl"
        class="justify-center"
        @click="emits('undo')"
      >
        Annuler
      </UButton>
      <UButton
        color="success"
        trailing-icon="i-lucide-check"
        class="justify-center"
        size="xl"
        @click="emits('confirmThrows')"
      >
        Confirmer
      </UButton>
    </div>

    <div
      class="-translate-x-full -z-10 absolute bg-accented/75 duration-1500 h-full opacity-0 top-0 transition-transform w-full"
      :class="{ 'opacity-100 translate-x-0': timeout !== null }"
    />
  </div>
</template>
