import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/hooks/useTheme";

interface Props {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      title="Toggle light/dark theme"
      aria-label="Toggle light/dark theme"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
