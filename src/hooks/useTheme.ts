import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "jobTracker.theme";
export type Theme = "light" | "dark";

/** Light/dark theme state, applied as a `.dark` class on <html> and persisted. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(THEME_KEY) as Theme) || "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, toggle };
}
