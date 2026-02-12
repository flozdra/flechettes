import { useSound } from "@vueuse/sound";
import doneMp3 from "assets/sounds/done.mp3";
import hitDartMp3 from "assets/sounds/hit-dart.mp3";

export function useSounds() {
  const done = useSound(doneMp3);
  const hitDart = useSound(hitDartMp3);

  return {
    done,
    hitDart,
  };
}
