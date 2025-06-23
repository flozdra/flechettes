import { useSound } from "@vueuse/sound";
import buzzerMp3 from "assets/sounds/buzzer.mp3";
import failSlowMp3 from "assets/sounds/fail-slow.mp3";
import failTrumpetMp3 from "assets/sounds/fail-trumpet.mp3";
import fartMp3 from "assets/sounds/fart.mp3";
import hitDartMp3 from "assets/sounds/hit-dart.mp3";
import orchestralWinMp3 from "assets/sounds/orchestral-win.mp3";
import rifleMp3 from "assets/sounds/rifle.mp3";
import sniperMp3 from "assets/sounds/sniper.mp3";
import wowMp3 from "assets/sounds/wow.mp3";

export function useSoundEffects() {
  const buzzer = useSound(buzzerMp3);
  const failSlow = useSound(failSlowMp3);
  const failTrumpet = useSound(failTrumpetMp3);
  const fart = useSound(fartMp3);
  const hitDart = useSound(hitDartMp3);
  const orchestralWin = useSound(orchestralWinMp3);
  const rifle = useSound(rifleMp3);
  const sniper = useSound(sniperMp3);
  const wow = useSound(wowMp3);

  defineShortcuts({
    meta_1: () => buzzer.play(),
    meta_2: () => failSlow.play(),
    meta_3: () => failTrumpet.play(),
    meta_4: () => wow.play(),
  });

  return {
    buzzer,
    failSlow,
    failTrumpet,
    fart,
    hitDart,
    orchestralWin,
    rifle,
    sniper,
    wow,
  };
}
