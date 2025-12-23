/**
 * Bu bileşen, tüm abonelik paketlerini ızgara (grid) düzeninde listeler.
 * Her bir paket için `PricingCard` bileşenini render eder ve kullanıcının mevcut durumuna
 * göre gerekli propları (isCurrent, currentPlanPrice vb.) iletir.
 */

import { AbonelikPaketi } from "@/types";
import PricingCard from "./PricingCard";

interface PricingGridProps {
  plans: AbonelikPaketi[]; // Gösterilecek tüm planlar
  currentPlanId?: number | null; // Kullanıcının mevcut planının ID'si (varsa)
}

export default function PricingGrid({
  plans,
  currentPlanId,
}: PricingGridProps) {
  // Mevcut planın fiyatını bul (Yükseltme/Düşürme kontrolü için PricingCard'a lazım)
  // Eğer kullanıcının bir planı varsa, o planın fiyatını diziden buluyoruz.
  const currentPlanPrice = currentPlanId
    ? plans.find((p) => p.id === currentPlanId)?.fiyat || 0
    : 0;

  // Kullanıcının aktif bir planı var mı?
  const hasActiveSubscription = !!currentPlanId;

  return (
    <div className="grid gap-8 md:grid-cols-3 md:gap-4 lg:gap-12">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          isPopular={plan.paket_adi === "Standart"} // Örnek mantık: "Standart" planı popüler olarak işaretle
          isCurrent={currentPlanId === plan.id} // Bu kart kullanıcının mevcut planı mı?
          hasActiveSubscription={hasActiveSubscription}
          currentPlanPrice={currentPlanPrice} // Mevcut plan fiyatını ilet
        />
      ))}
    </div>
  );
}
