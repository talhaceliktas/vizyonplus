// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // useEffect yalnızca istemcide çalışır
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR (Sunucu Tarafı Render) sırasında
    // veya istemci mount olana kadar
    // children'ı olduğu gibi render et
    // Bu, hydration (nemlendirme) hatalarını önler
    return <>{children}</>;
  }

  // İstemci mount olduktan sonra ThemeProvider'ı render et
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
