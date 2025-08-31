<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean;
  hits: DartThrowRecord[];
  highlights?: DartThrowId[];
}>();

const emit = defineEmits<{
  hit: [dartThrow: DartThrow, coordinates: ThrowCoordinates];
}>();

const settings = useSettings();
const soundEffects = useSoundEffects();

/**
 * Emit a new hit event with dummy coordinates (0,0) since this is not a dartboard
 */
function emitNewHit(dartThrow: DartThrow) {
  const coordinates = { x: 0, y: 0 };
  emit("hit", dartThrow, coordinates);
  soundEffects.hitDart.play();
}

/**
 * Define the attributes for each button of the table
 */
function getAttributes(dartThrow: DartThrow) {
  const highlightEnabled =
    settings.value.highlightNumbers && props.highlights?.length;

  const isHighlighted =
    highlightEnabled &&
    props.highlights.includes(dartThrow.id) &&
    dartThrow.id !== "OUT";

  const backgroundColor =
    dartThrow.id === "DB" || dartThrow.id.startsWith("T")
      ? DartColors.Red
      : dartThrow.id === "SB" || dartThrow.id.startsWith("D")
      ? DartColors.Green
      : DartColors.Black;

  return {
    class: [
      "flex items-center justify-center text-lg sm:text-xl md:text-2xl transition-transform p-1",
      props.disabled
        ? "opacity-40"
        : "active:scale-105 active:-m-px active:border active:z-10",
      ...(highlightEnabled ? [isHighlighted ? "ring-2" : "opacity-60"] : []),
    ],
    disabled: props.disabled,
    touchAction: "manipulation",
    style: { backgroundColor: backgroundColor + "CC" }, // Opacity 80%
    onClick: () => emitNewHit(dartThrow),
  };
}

const SimpleDartThrows = Object.values(DartThrows)
  .filter((dartThrow) => dartThrow.id.startsWith("S") && dartThrow.id !== "SB")
  .reverse();
const DoubleDartThrows = Object.values(DartThrows)
  .filter((dartThrow) => dartThrow.id.startsWith("D") && dartThrow.id !== "DB")
  .reverse();
const TripleDartThrows = Object.values(DartThrows)
  .filter((dartThrow) => dartThrow.id.startsWith("T"))
  .reverse();
</script>

<template>
  <div class="gap-0.5 grid grid-cols-3 text-center">
    <!-- First column -->
    <div class="gap-0.5 grid grid-cols-2">
      <button class="col-span-2" v-bind="getAttributes(DartThrows.OUT)">
        {{ DartThrows.OUT.id }}
      </button>
      <button
        v-for="dartThrow in SimpleDartThrows"
        :key="dartThrow.id"
        v-bind="getAttributes(dartThrow)"
      >
        {{ dartThrow.id }}
      </button>
    </div>

    <!-- Second column -->
    <div class="gap-0.5 grid grid-cols-2">
      <button class="col-span-2" v-bind="getAttributes(DartThrows.SB)">
        {{ DartThrows.SB.id }}
      </button>
      <button
        v-for="dartThrow in DoubleDartThrows"
        :key="dartThrow.id"
        v-bind="getAttributes(dartThrow)"
      >
        {{ dartThrow.id }}
      </button>
    </div>

    <!-- Third column -->
    <div class="gap-0.5 grid grid-cols-2">
      <button class="col-span-2" v-bind="getAttributes(DartThrows.DB)">
        {{ DartThrows.DB.id }}
      </button>
      <button
        v-for="dartThrow in TripleDartThrows"
        :key="dartThrow.id"
        v-bind="getAttributes(dartThrow)"
      >
        {{ dartThrow.id }}
      </button>
    </div>
  </div>
</template>
