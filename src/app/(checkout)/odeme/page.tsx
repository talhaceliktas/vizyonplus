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

// BU DOSYA NE İŞE YARAR?
// Ödeme işlemlerinin yapıldığı ana sayfadır.
// Burada kullanıcının seçtiği paket, mevcut aboneliği varsa aradaki fark hesaplanır
// ve ödeme formu gösterilir.

interface PaymentPageProps {
  // searchParams: URL'deki soru işaretinden sonraki parametrelerdir (örn: ?plan=2)
  // Next.js 15'te searchParams bir "Promise" olduğu için await ile çözümlenmelidir.
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  // 1. KULLANICI KONTROLÜ
  // Supabase ile sunucu tarafında oturum açmış kullanıcıyı buluyoruz.
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Eğer kullanıcı yoksa, giriş sayfasına yolla ve işlem bitince buraya (next=/odeme) geri dönsün.
  if (!user) redirect("/giris?next=/odeme");

  // 2. PARAMETRELERİ AL
  const resolvedSearchParams = await searchParams;
  const planId = Number(resolvedSearchParams.plan);

  // Plan ID geçersizse abonelikler sayfasına geri gönder.
  if (!planId || isNaN(planId)) redirect("/abonelikler");

  // 3. VERİLERİ PARALEL ÇEK (Performance Optimization)
  // Hem kullanıcının mevcut aboneliğini hem de yeni seçtiği planı aynı anda soruyoruz.
  // Promise.all: İkisi de bitene kadar bekler (daha hızlıdır).
  const [activeSubscription, newPlan] = await Promise.all([
    getCurrentUserSubscription(user.id),
    getSubscriptionPlanById(planId),
  ]);

  // Eğer veritabanında böyle bir plan yoksa geri gönder.
  if (!newPlan) redirect("/abonelikler");

  // --- MANTIK VE HESAPLAMA ---

  let isUpgrade = false;
  let payPrice = newPlan.fiyat; // Varsayılan: Tam fiyat

  // Eğer kullanıcının zaten bir aboneliği varsa:
  if (activeSubscription) {
    const currentPrice = activeSubscription.paket.fiyat;

    // YÜKSELTME KONTROLÜ (Upgrade)
    // Eğer yeni plan daha pahalıysa, aradaki farkı ödemesi gerekir.
    if (newPlan.fiyat > currentPrice) {
      isUpgrade = true;
      // FARK HESABI: Yeni Fiyat - Eski Fiyat
      payPrice = Math.max(0, newPlan.fiyat - currentPrice);
    } else {
      // Düşürme (Downgrade) şu an desteklenmiyor veya mantıksız, uyarı göster.
      return <ExistingSubscriptionAlert subscription={activeSubscription} />;
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Yükseltme Uyarısı: "Paketiniz X'ten Y'ye yükseltiliyor" */}
        {isUpgrade && activeSubscription && (
          <UpgradeInfoAlert
            currentPlanName={activeSubscription.paket.paket_adi}
            newPlanName={newPlan.paket_adi}
          />
        )}

        {/* Başlık Bileşeni */}
        <PaymentHeader planName={newPlan.paket_adi} isUpgrade={isUpgrade} />

        <div className="grid gap-10 lg:grid-cols-12">
          {/* SOL TARAFI: Ödeme Formu */}
          <div className="lg:col-span-7">
            <PaymentForm planId={newPlan.id} />
            <SecurityBadges />
          </div>

          {/* SAĞ TARAF: Sipariş Özeti */}
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
