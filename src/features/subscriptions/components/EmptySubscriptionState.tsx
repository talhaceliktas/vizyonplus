/**
 * Bu bileşen, kullanıcının aktif bir aboneliği olmadığında gösterilir.
 * Kullanıcıyı planları incelemeye teşvik eden bir boş durum (empty state) kartıdır.
 */

import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";

export default function EmptySubscriptionState() {
  return (
    <div className="border-primary-800 bg-primary-900/50 flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed py-24 text-center">
      {/* İkon Alanı */}
      <div className="relative">
        <div className="bg-secondary-1/10 absolute inset-0 animate-pulse rounded-full blur-xl"></div>
        <div className="border-primary-700 bg-primary-800 relative flex h-20 w-20 items-center justify-center rounded-full border-2">
          <CreditCard className="text-primary-400 h-8 w-8" />
        </div>
      </div>

      {/* Metin Alanı */}
      <div className="max-w-md px-4">
        <h3 className="text-primary-50 text-xl font-bold md:text-2xl">
          Aktif bir aboneliğin bulunmuyor
        </h3>
        <p className="text-primary-400 mt-2 text-sm md:text-base">
          Vizyon+ dünyasındaki binlerce film ve diziye erişmek için hemen sana
          uygun bir plan seç.
        </p>
      </div>

      {/* Aksiyon Butonu */}
      <Link
        href="/abonelikler"
        className="group bg-secondary-1 text-primary-950 hover:bg-secondary-2 hover:shadow-secondary-1/20 mt-2 flex items-center gap-2 rounded-full px-8 py-3.5 font-bold transition-all hover:scale-105 hover:shadow-lg"
      >
        Planları Gör
        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
