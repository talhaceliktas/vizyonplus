import type { Metadata } from "next";
import "@styles/globals.css";

import { getCachedSettings } from "@settings/services/settingsService";
import MaintenanceMode from "../features/settings/components/MaintenanceControl";
import { Providers } from "../lib/providers/Providers";
import { Table } from "../types";
import NavbarWrapper from "../features/navigation/components/NavbarWrapper";
import { Toaster } from "react-hot-toast";

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
  const settings: Table<"ayarlar"> = await getCachedSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {settings.bakim_modu ? (
            <MaintenanceMode>{children}</MaintenanceMode>
          ) : (
            <>
              <NavbarWrapper settings={settings} />
              {children}
            </>
          )}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
