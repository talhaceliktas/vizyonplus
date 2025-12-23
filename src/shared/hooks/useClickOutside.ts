import { useEffect, useState, RefObject } from "react";

// BU DOSYA NE İŞE YARAR?
// Özel bir "Custom Hook" tur.
// Bir elementin dışına tıklandığını algılar.
// Genellikle açılır menüleri (Dropdown, Modal) kapatmak için kullanılır.

export default function useClickOutside<T extends HTMLElement>(
  elementRef: RefObject<T | null>, // Dışına tıklanması takip edilecek elementin referansı
) {
  // Menünün açık/kapalı durumunu burada tutuyoruz
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Tıklama olayını yakalayan fonksiyon
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Eğer menü zaten kapalıysa veya element henüz yüklenmediyse işlem yapma
      if (!isOpen || !elementRef.current) return;

      const target = event.target as Node;

      // Tıklanan yer, bizim elementimizin İÇİNDE mi?
      // Eğer içindeyse (contains) hiçbir şey yapma (return).
      if (elementRef.current.contains(target)) {
        return;
      }

      // Değilse (Dışarı tıklanmışsa) menüyü kapat.
      setIsOpen(false);
    };

    // Tüm sayfada tıklama olaylarını dinle (mousedown ve touchstart)
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    // Temizlik (Cleanup): Hook devreden çıkınca dinleyicileri kaldır.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [elementRef, isOpen]); // elementRef veya isOpen değişirse hook yeniden çalışır.

  return { isOpen, setIsOpen };
}
