import { useEffect, useState } from "react";

/* Header tingginya h-16 = 64px; sections pakai scroll-mt-16 (64px).
   Spy harus aktif tepat saat section mendarat di bawah header. */
const HEADER_OFFSET = 64;

export function useScrollSpy(ids: string[], offset = HEADER_OFFSET) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        current = ids[ids.length - 1] ?? current;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}