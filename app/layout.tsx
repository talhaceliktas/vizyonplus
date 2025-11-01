import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./_lib/fontlar";

import Navbar from "./_components/Navbar";
import { Toaster } from "react-hot-toast";
import { Providers } from "./_lib/next-theme/Providers";

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
      <body
        className={`from-primary-900 via-primary-800 to-primary-900 min-h-screen bg-gradient-to-l antialiased ${poppins.className}`}
      >
        <Providers>
          <Navbar />
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
