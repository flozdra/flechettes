import { useSound } from "@vueuse/sound";
import fartMp3 from "assets/sounds/fart.mp3";
import hitDartMp3 from "assets/sounds/hit-dart.mp3";
import orchestralWinMp3 from "assets/sounds/orchestral-win.mp3";
import rifleMp3 from "assets/sounds/rifle.mp3";
import sniperMp3 from "assets/sounds/sniper.mp3";

export function useSoundEffects() {
  const fart = useSound(fartMp3);
  const hitDart = useSound(hitDartMp3);
  const orchestralWin = useSound(orchestralWinMp3);
  const rifle = useSound(rifleMp3);
  const sniper = useSound(sniperMp3);

  return {
    fart,
    hitDart,
    orchestralWin,
    rifle,
    sniper,
  };
}
