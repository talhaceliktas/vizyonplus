import type { Metadata } from "next";
import "./globals.css";

import { getCachedSettings, SiteSettings } from "./_lib/supabase/get-settings";
import BakimKontrol from "./_components/BakimKontrol";
import AnaLayout from "./_components/AnaLayout";

export const metadata: Metadata = {
  title: "Vizyon+ | Modern Dizi & Film Platformu",
  description:
    "Vizyon+, Next.js, Supabase ve Tailwind CSS kullanılarak geliştirilmiş, Netflix benzeri modern bir dizi ve film izleme platformudur. Kullanıcılar içerikleri keşfedebilir, filtreleyebilir, favorilerine ekleyebilir ve yorum yapabilir.",
  keywords: [
    "Vizyon+",
    "dizi izle",
    "film platformu",
    "Next.js",
    "Supabase",
    "Tailwind CSS",
    "React",
    "film izleme sitesi",
    "modern web uygulaması",
  ],
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings: SiteSettings = await getCachedSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {settings.bakim_modu ? (
          <BakimKontrol>
            <AnaLayout>{children}</AnaLayout>
          </BakimKontrol>
        ) : (
          <AnaLayout>{children}</AnaLayout>
        )}
      </body>
    </html>
  );
}
