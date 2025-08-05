<script lang="ts" setup>
interface Props {
  currentThrows: DartThrowRecord[];
  invalidTurn?: boolean;
  showScore?: boolean;
  winningCombination?: DartThrow[];
}
const props = defineProps<Props>();
const emits = defineEmits<{ "auto-confirm-throws": [] }>();

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
        emits("auto-confirm-throws");
        timeout.value = null;
      }, 1500);
    }
  }
);
</script>

<template>
  <div
    class="relative grid text-5xl whitespace-nowrap border border-muted p-3 rounded-lg overflow-hidden transition-colors duration-500"
    :class="{
      'grid-cols-4': showScore,
      'grid-cols-3': !showScore,
    }"
  >
    <div v-for="i in 3" :key="i" class="py-3 text-center">
      <span
        v-if="currentThrows[i - 1]"
        class="font-bold"
        :class="invalidTurn && 'text-error'"
      >
        {{ currentThrows[i - 1].dartThrow.label }}
      </span>
      <span v-else-if="winningCombination?.[i - 1]" class="italic opacity-50">
        {{ winningCombination[i - 1].label }}
      </span>
      <span v-else>·</span>
    </div>

    <UBadge
      v-if="showScore"
      class="justify-center w-30 mx-auto text-5xl rounded-xl font-bold"
      variant="subtle"
      :color="invalidTurn ? 'error' : 'neutral'"
    >
      {{ currentThrowsScore }}
    </UBadge>

    <div
      class="absolute w-full h-full -translate-x-full bg-accented/75 -z-10 transition-transform opacity-0 duration-1500"
      :class="{ 'opacity-100 translate-x-0': timeout !== null }"
    />
  </div>
</template>
