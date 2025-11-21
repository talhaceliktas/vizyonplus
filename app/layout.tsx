import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./_lib/fontlar";

import { Toaster } from "react-hot-toast";
import { Providers } from "./_lib/next-theme/Providers";
import NavbarThemeChecker from "./_components/NavbarThemeChecker";

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
    "Netflix klonu",
    "film izleme sitesi",
    "modern web uygulaması",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <main
            className={`from-primary-950 via-primary-800/40 to-primary-950 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900 min-h-screen bg-gradient-to-l antialiased transition-colors duration-300 ${poppins.className}`}
          >
            <NavbarThemeChecker />
            {children}
            <Toaster position="bottom-right" />
          </main>
        </Providers>
      </body>
    </html>
  );
}
