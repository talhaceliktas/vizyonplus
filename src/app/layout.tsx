import type { Metadata } from "next";
import "@styles/globals.css";

import { getCachedSettings } from "@settings/services/settingsService";
import MaintenanceMode from "../features/settings/components/MaintenanceControl";
import { Providers } from "../lib/providers/Providers";
import { Table } from "../types";
import NavbarWrapper from "../features/navigation/components/NavbarWrapper";
import { Toaster } from "react-hot-toast";

// BU DOSYA NE İŞE YARAR?
// Next.js App Router'ın EN KÖK dosyasıdır. Tüm uygulama bu "RootLayout" içine sarılır.
// HTML ve BODY etiketleri burada tanımlanır.
// Her sayfada ortak olan şeyler (Navbar, Footer, Fontlar, Context Provider'lar) buraya konur.

// GLOBAL METADATA (SEO)
// Tüm sitenin varsayılan başlık ve açıklamalarıdır.
// Alt sayfalar kendi metadata'sını eklerse, buradakileri ezer veya birleştirir.
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

// ROOT LAYOUT BİLEŞENİ
// "children": O an hangi sayfadaysanız (page.tsx), o içeriği temsil eder.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SUNUCU TARAFI AYAR KONTROLÜ
  // Site bakım modunda mı? Logo ne? gibi ayarları veritabanından çeker.
  // Bu bir Server Component olduğu için "await" kullanabiliriz.
  const settings: Table<"ayarlar"> = await getCachedSettings();

  return (
    // suppressHydrationWarning: Bazı eklentilerin HTML yapısını değiştirmesi hatasını susturur.
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* PROVIDERS: Uygulama genelinde veri taşıyan Context yapıları (Auth, Theme vs.) */}
        <Providers>
          {/* BAKIM MODU KONTROLÜ */}
          {/* Eğer bakım modu açıksa site içeriği yerine sadece bakım ekranını göster. */}
          {settings.bakim_modu ? (
            <MaintenanceMode>{children}</MaintenanceMode>
          ) : (
            <>
              {/* NAVBAR: Üst menü (Ayarları props olarak alır) */}
              <NavbarWrapper settings={settings} />

              {/* SAYFA İÇERİĞİ: O anki rota ne ise (Örn: /giris, /filmler) o buraya gelir. */}
              {children}
            </>
          )}

          {/* TOASTER: Bildirim (Notification) göstermek için kullanılan bileşen */}
          {/* position="bottom-right": Ekranın sağ altında çıkar. */}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
