import { useEffect, useState } from "react";

export function useTypingEffect(
  texts: string[],
  typingSpeed: number = 80,
  deletingSpeed: number = 50,
  pauseDuration: number = 2000,
) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(texts[0] || "");
      return;
    }

    const currentText = texts[textIndex] || "";

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % texts.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}
