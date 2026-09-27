import { useEffect, useState } from "react";

export function useCountUp(
  end: number,
  duration: number = 2000,
  start: number = 0,
) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    const diff = end - start;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + diff * easeOutQuart);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, start, duration, hasStarted]);

  const startCounting = () => setHasStarted(true);

  return { count, startCounting };
}
