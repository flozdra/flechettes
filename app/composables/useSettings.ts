import { useLocalStorage } from "@vueuse/core";

interface Settings {
  dartboard: "dartboard" | "table";
  autoConfirmThrows: boolean;
  highlightNumbers: boolean;
}

const defaultSettings: Settings = {
  dartboard: "dartboard",
  autoConfirmThrows: true,
  highlightNumbers: true,
};

export function useSettings() {
  const settings = useLocalStorage<Settings>("settings", defaultSettings, {
    deep: true,
  });

  // Ensure all settings are present (useful for future updates)
  for (const key in defaultSettings) {
    if (!(key in settings.value)) {
      // @ts-expect-error - We know the keys and settings match
      settings.value[key] = defaultSettings[key];
    }
  }

  return settings;
}
