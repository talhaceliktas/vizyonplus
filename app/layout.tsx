import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./_lib/fontlar";

import Navbar from "./_components/Navbar";
import { Toaster } from "react-hot-toast";
import { Providers } from "./_lib/next-theme/Providers";
import { ThemeSwitcher } from "./_lib/next-theme/ThemeSwitcher";

export const metadata: Metadata = {
  title: "Vizyon+",
  description: "Sinema rezervasyon sistemi",
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
            <Navbar />
            {children}
            <Toaster position="bottom-right" />
            <ThemeSwitcher />
          </main>
        </Providers>
      </body>
    </html>
  );
}
