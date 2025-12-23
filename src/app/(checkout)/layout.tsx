import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import vizyonPlusLogo from "@public/logo.png"; // Logo yolunu ayarla

// BU DOSYA NE İŞE YARAR?
// Ödeme ve satın alma sayfalarının ortak düzenidir (Layout).
// Normal site menüsünden farklı olarak, kullanıcının dikkati dağılmasın diye
// sadece logo ve "Güvenli Ödeme" ibaresi içeren sade bir üst menü bulunur.

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* SADE HEADER */}
      {/* sticky top-0: Sayfa aşağı kaydırılsa bile üstte sabit kalır. */}
      {/* backdrop-blur: Arkasındaki içeriği buzlu cam gibi gösterir. */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo: Ana sayfaya yönlendirir */}
          <Link
            href="/"
            className="opacity-80 transition-opacity hover:opacity-100"
          >
            <Image
              src={vizyonPlusLogo}
              alt="Vizyon Plus"
              width={120}
              className="object-contain"
              priority
            />
          </Link>

          {/* Güvenlik İbaresi: Kullanıcıya güven vermek için */}
          <div className="flex items-center gap-2 text-sm font-medium text-green-500">
            <Lock size={16} />
            <span className="hidden sm:inline">Güvenli Ödeme</span>
          </div>
        </div>
      </header>

      {/* SAYFA İÇERİĞİ */}
      {/* "children" prop'u, bu layout içinde render edilen sayfayı (page.tsx) temsil eder. */}
      <main>{children}</main>

      {/* SADE FOOTER */}
      <footer className="mt-12 border-t border-white/10 py-8 text-center text-xs text-gray-600">
        <p>© 2025 Vizyon+. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
