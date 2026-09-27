import { useCallback, useState } from "react";

export function useCardTilt(maxTilt: number = 8) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * maxTilt * 2;
      const tiltY = (0.5 - x) * maxTilt * 2;

      setTilt({ x: tiltX, y: tiltY });
      setIsHovering(true);
    },
    [maxTilt],
  );

  const onMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  }, []);

  const style = {
    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: isHovering
      ? "transform 0.2s cubic-bezier(0.2, 0, 0, 1)"
      : "transform 0.5s cubic-bezier(0.2, 0, 0, 1)",
  };

  return { onMouseMove, onMouseLeave, style };
}
