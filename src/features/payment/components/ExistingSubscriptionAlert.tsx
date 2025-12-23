/**
 * Bu bileşen, kullanıcı zaten sahip olduğu bir paketi tekrar satın almaya çalıştığında gösterilir.
 * Kullanıcının mevcut paketini ve bitiş tarihini gösterir.
 * Satın alma işlemini engeller ve kullanıcıyı yönlendirir.
 */

import Link from "next/link";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { UserSubscription } from "../../subscriptions/services/subscriptionService";

interface Props {
  subscription: UserSubscription;
}

export default function ExistingSubscriptionAlert({ subscription }: Props) {
  // Tarihi Türkçe formatına çevir
  const bitisTarihi = new Date(subscription.bitis_tarihi).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric" },
  );

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-black px-4 text-center text-white">
      {/* İkon ve Efektler */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-xl"></div>
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-500/30 bg-green-900/20 shadow-2xl">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
      </div>

      <h1 className="mb-2 text-3xl font-black md:text-4xl">
        Bu Pakete Zaten Sahipsin
      </h1>

      <p className="mb-8 max-w-lg text-lg text-gray-400">
        Şu anda{" "}
        <span className="font-bold text-white">
          {subscription.paket.paket_adi}
        </span>{" "}
        paketini kullanıyorsun. Daha düşük bir pakete geçmek için mevcut
        aboneliğinin bitmesini (
        <span className="text-white">{bitisTarihi}</span>) beklemen gerekiyor.
      </p>

      {/* Yönlendirme Butonları */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/abonelikler"
          className="group flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-bold text-black transition-all hover:scale-105 hover:bg-green-400 active:scale-95"
        >
          <span>Planlara Dön</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10"
        >
          <Home className="h-5 w-5" />
          <span>Ana Sayfa</span>
        </Link>
      </div>
    </div>
  );
}
