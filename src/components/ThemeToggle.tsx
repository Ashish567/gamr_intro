import type { ThemeName } from "../hooks/useTheme";
import "./ThemeToggle.css";

interface ThemeToggleProps {
  theme: ThemeName;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" onClick={onToggle}>
      {theme === "dark" ? "☾ NIGHT SANDS" : "☀ DESERT DUSK"}
    </button>
  );
}
