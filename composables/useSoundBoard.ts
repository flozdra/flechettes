import { useLocalStorage } from "@vueuse/core";

type SoundBoardKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type SoundBoard = Record<SoundBoardKey, string | null>;

// prettier-ignore
const keys: SoundBoardKey[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

let shortcutsRegistered = false;

export function useSoundBoard() {
  const soundBoard = useLocalStorage<SoundBoard>(
    "soundboard",
    Object.fromEntries(keys.map((k) => [k, null])) as SoundBoard,
    { deep: true }
  );

  function playAudio(key: SoundBoardKey) {
    const url = soundBoard.value[key];
    if (url) new Audio(url).play().catch(console.error);
  }

  if (!shortcutsRegistered) {
    defineShortcuts(
      Object.fromEntries(keys.map((key) => [key, () => playAudio(key)]))
    );
    shortcutsRegistered = true;
  }

  return { soundBoard, keys, playAudio };
}
