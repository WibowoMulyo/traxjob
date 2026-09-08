import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/* Keep toast colors aligned with the app's `.dark` class. */
function useThemeMode(): "light" | "dark" {
  const [mode, setMode] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    const root = document.documentElement;
    const update = () =>
      setMode(root.classList.contains("dark") ? "dark" : "light");
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return mode;
}

export function Toaster(props: ToasterProps) {
  const theme = useThemeMode();
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      richColors
      closeButton
      {...props}
    />
  );
}
