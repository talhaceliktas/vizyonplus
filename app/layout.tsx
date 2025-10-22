import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./_lib/fontlar";

import Navbar from "./_components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Biletcim",
  description: "Sinema rezervasyon sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`from-primary-900 via-primary-800 to-primary-900 min-h-screen bg-gradient-to-l antialiased ${poppins.className}`}
      >
        <Navbar />
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
