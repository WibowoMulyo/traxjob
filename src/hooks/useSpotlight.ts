import { useCallback } from "react";

export function useSpotlight<T extends HTMLElement>() {
  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${Math.round(e.clientX - rect.left)}px`);
    el.style.setProperty("--my", `${Math.round(e.clientY - rect.top)}px`);
  }, []);

  return onMouseMove;
}