<script lang="ts" setup>
interface Props {
  round: number;
}
const props = defineProps<Props>();

const displayedRound = ref(props.round);
const transition = ref<"slide-left" | "slide-right">("slide-left");

watch(
  () => props.round,
  (newRound, oldRound) => {
    transition.value = newRound > oldRound ? "slide-right" : "slide-left";
    displayedRound.value = newRound;
  }
);
</script>

<template>
  <div>
    <Transition :name="transition" mode="out-in">
      <div :key="displayedRound" class="text-4xl font-bold px-4 text-center">
        Tour {{ displayedRound }}
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="css">
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.15s ease-in-out;
}

.slide-left-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.slide-left-enter-to,
.slide-right-leave-from,
.slide-right-enter-to,
.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
.slide-left-leave-to,
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
</style>
