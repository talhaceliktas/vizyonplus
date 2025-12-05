import { useEffect, useState, RefObject } from "react";

export default function useClickOutside<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!isOpen || !elementRef.current) return;

      const target = event.target as Node;

      if (elementRef.current.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [elementRef, isOpen]);

  return { isOpen, setIsOpen };
}
