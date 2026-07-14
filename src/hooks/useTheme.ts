import { useEffect, useState } from "react";

export type ThemeName = "dark" | "bright";

const STORAGE_KEY = "gamr-intro-theme";

function readStoredTheme(): ThemeName {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "bright" ? "bright" : "dark";
}

export function useTheme(): [ThemeName, () => void] {
  const [theme, setTheme] = useState<ThemeName>(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "bright" : "dark"));

  return [theme, toggle];
}
