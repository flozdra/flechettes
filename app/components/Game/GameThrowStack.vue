<script lang="ts" setup>
interface Props {
  playerNames: string[];
  throws: DartThrowRecord[][];
  showTotal?: boolean;
}
const props = defineProps<Props>();

/** Stack of all throws made in the game */
const throwStack = computed(() => {
  const stack: { player: string; throws: DartThrowRecord[] }[] = [];
  for (const [i, turnThrows] of props.throws.entries()) {
    const playerIndex = i % props.playerNames.length;
    const player = props.playerNames[playerIndex]!;
    stack.push({ player, throws: turnThrows });
  }
  return stack;
});

const highlightedPlayer = ref<string | null>(null);

function highlightPlayer(player: string | null) {
  if (highlightedPlayer.value === player) {
    highlightedPlayer.value = null;
  } else {
    highlightedPlayer.value = player;
  }
}
</script>

<template>
  <div class="max-h-[calc(100vh-82px)] overflow-y-auto">
    <table class="table-fixed w-full">
      <tbody class="border border-accented">
        <template v-for="(turn, i) in throwStack.toReversed()" :key="i">
          <tr
            class="bg-accented font-semibold text-center"
            :class="
              highlightedPlayer === turn.player
                ? 'bg-primary text-primary-900 border-primary/25'
                : highlightedPlayer
                  ? 'opacity-50'
                  : ''
            "
            @click="highlightPlayer(turn.player)"
          >
            <td :colspan="showTotal ? 4 : 3" class="font-bold text-center">
              {{ turn.player }}
            </td>
          </tr>
          <tr
            class="divide-accented divide-x italic text-center"
            :class="
              highlightedPlayer === turn.player
                ? 'text-primary'
                : highlightedPlayer
                  ? 'opacity-50'
                  : ''
            "
            @click="highlightPlayer(null)"
          >
            <td class="text-center">
              {{ turn.throws[0]?.dartThrow.id ?? "-" }}
            </td>
            <td class="text-center">
              {{ turn.throws[1]?.dartThrow.id ?? "-" }}
            </td>
            <td class="text-center">
              {{ turn.throws[2]?.dartThrow.id ?? "-" }}
            </td>
            <td v-if="showTotal" class="bg-accented/25 font-bold">
              {{
                turn.throws.reduce(
                  (sum, record) => sum + record.dartThrow.score,
                  0,
                )
              }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
