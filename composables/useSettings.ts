import { useLocalStorage } from "@vueuse/core";

interface Settings {
  autoConfirmThrows: boolean;
  highlightNumbers: boolean;
}

const defaultSettings: Settings = {
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
      settings.value[key as keyof Settings] =
        defaultSettings[key as keyof Settings];
    }
  }

  return settings;
}
