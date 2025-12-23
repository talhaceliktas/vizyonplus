import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode; // React bileşeni (SVG ikon vb.) olabilir
  colorClass: string; // Dinamik stil sınıfı (örn: "text-blue-400 bg-blue-500/10")
}

// BU DOSYA NE İŞE YARAR?
// Admin panelinde en üstte duran istatistik kartlarıdır.
// Örn: Toplam Kullanıcı, Toplam Gelir vb.

export default function StatCard({
  title,
  value,
  icon,
  colorClass,
}: StatCardProps) {
  return (
    <div className="group border-primary-700 bg-primary-800/40 hover:border-primary-600 hover:bg-primary-800/60 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        {/* Metin ve Değer */}
        <div className="flex flex-col gap-3">
          <p className="text-primary-400 text-sm font-medium tracking-wide">
            {title}
          </p>
          {/* toLocaleString: Sayıyı formatla (1000 -> 1.000) */}
          <p className="text-primary-50 text-3xl font-bold tracking-tight lg:text-4xl">
            {value.toLocaleString("tr-TR")}
          </p>
        </div>

        {/* İkon Alanı */}
        <div
          className={`shrink-0 rounded-xl p-3.5 shadow-inner ring-1 transition-transform ring-inset group-hover:scale-110 ${colorClass}`}
        >
          {icon}
        </div>
      </div>

      {/* Dekoratif Arka Plan Efekti (Blur) */}
      <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-current opacity-[0.03] blur-3xl transition-opacity group-hover:opacity-[0.07]" />
    </div>
  );
}
