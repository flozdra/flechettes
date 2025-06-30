import { useLocalStorage } from "@vueuse/core";

interface Settings {
  autoConfirmThrows: boolean;
}
export function useSettings() {
  const settings = useLocalStorage<Settings>(
    "settings",
    { autoConfirmThrows: true },
    { deep: true }
  );

  return settings;
}
