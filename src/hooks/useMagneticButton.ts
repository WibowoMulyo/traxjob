import { useCallback, useEffect, useRef, useState } from "react";

export function useMagneticButton(strength: number = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      const attractionRadius = Math.max(rect.width, rect.height) * 2;

      if (distance < attractionRadius) {
        setIsHovering(true);
        setPosition({
          x: distanceX * strength,
          y: distanceY * strength,
        });
      } else if (isHovering) {
        setIsHovering(false);
        setPosition({ x: 0, y: 0 });
      }
    },
    [strength, isHovering],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: isHovering
      ? "transform 0.3s cubic-bezier(0.2, 0, 0, 1)"
      : "transform 0.5s cubic-bezier(0.2, 0, 0, 1)",
  };

  return { ref, style };
}
