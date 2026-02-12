import { useLocalStorage } from "@vueuse/core";

type SoundboardKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Soundboard = Record<SoundboardKey, string | null>;

// prettier-ignore
const keys: SoundboardKey[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

let shortcutsRegistered = false;

export function useSoundboard() {
  const soundboard = useLocalStorage<Soundboard>(
    "soundboard",
    Object.fromEntries(keys.map((k) => [k, null])) as Soundboard,
    { deep: true },
  );

  function playAudio(key: SoundboardKey) {
    const url = soundboard.value[key];
    if (url) new Audio(url).play().catch(console.error);
  }

  if (!shortcutsRegistered) {
    defineShortcuts(
      Object.fromEntries(keys.map((key) => [key, () => playAudio(key)])),
    );
    shortcutsRegistered = true;
  }

  return { soundboard, keys, playAudio };
}
