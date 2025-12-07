// ... importlar aynı
import { redirect } from "next/navigation";
import supabaseServer from "@/lib/supabase/server";
import { getSubscriptionPlanById } from "@/features/subscriptions/services/subscriptionService";
import { getCurrentUserSubscription } from "@/features/subscriptions/services/subscriptionService";
import PaymentForm from "@/features/payment/components/PaymentForm";
import OrderSummary from "@/features/payment/components/OrderSummary";
import PaymentHeader from "@/features/payment/components/PaymentHeader";
import SecurityBadges from "@/features/payment/components/SecurityBadges";
import ExistingSubscriptionAlert from "../../../features/payment/components/ExistingSubscriptionAlert";
import UpgradeInfoAlert from "../../../features/payment/components/UpgradeInfoAlert";

interface PaymentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/giris?next=/odeme");

  // Parametre ve Veri Çekme
  const resolvedSearchParams = await searchParams;
  const planId = Number(resolvedSearchParams.plan);

  if (!planId || isNaN(planId)) redirect("/abonelikler");

  const [activeSubscription, newPlan] = await Promise.all([
    getCurrentUserSubscription(user.id),
    getSubscriptionPlanById(planId),
  ]);

  if (!newPlan) redirect("/abonelikler");

  // --- MANTIK VE HESAPLAMA ---

  let isUpgrade = false;
  let payPrice = newPlan.fiyat; // Varsayılan: Tam fiyat

  if (activeSubscription) {
    const currentPrice = activeSubscription.paket.fiyat;

    if (newPlan.fiyat > currentPrice) {
      isUpgrade = true;
      // FARK HESABI: Yeni Fiyat - Eski Fiyat
      // (Negatif çıkarsa 0 al, ama mantıken buraya sadece yüksekse giriyor)
      payPrice = Math.max(0, newPlan.fiyat - currentPrice);
    } else {
      // Düşürme engeli
      return <ExistingSubscriptionAlert subscription={activeSubscription} />;
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Yükseltme Uyarısı */}
        {isUpgrade && activeSubscription && (
          <UpgradeInfoAlert
            currentPlanName={activeSubscription.paket.paket_adi}
            newPlanName={newPlan.paket_adi}
          />
        )}

        {/* Başlık */}
        <PaymentHeader planName={newPlan.paket_adi} isUpgrade={isUpgrade} />

        <div className="grid gap-10 lg:grid-cols-12">
          {/* SOL: Form */}
          <div className="lg:col-span-7">
            <PaymentForm planId={newPlan.id} />
            <SecurityBadges />
          </div>

          {/* SAĞ: Özet */}
          <div className="lg:col-span-5">
            <OrderSummary
              plan={newPlan}
              // Eğer yükseltmeyse hesaplanan farkı, değilse undefined (tam fiyat) gönder
              customPrice={isUpgrade ? payPrice : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
