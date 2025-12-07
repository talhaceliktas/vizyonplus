import { Suspense } from "react";
import Link from "next/link";
import { Settings, CheckCircle } from "lucide-react"; // İkonlar
import supabaseServer from "@/lib/supabase/server";
import LoadingSpinner from "@shared/components/ui/LoadingSpinner";

// Servisler
import { getSubscriptionPlans } from "@/features/subscriptions/services/subscriptionService";
import { getCurrentUserSubscription } from "@/features/subscriptions/services/subscriptionService";

// Bileşenler
import PricingGrid from "@/features/subscriptions/components/PricingGrid";

export default async function SubscriptionsPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [plans, subscription] = await Promise.all([
    getSubscriptionPlans(),
    user ? getCurrentUserSubscription(user.id) : Promise.resolve(null),
  ]);

  const currentPlanId = subscription?.paket?.id;

  return (
    <div className="text-primary-900 min-h-screen px-4 py-28 transition-colors duration-300 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Başlık Alanı */}
        <div className="mb-12 text-center">
          <h1 className="text-primary-100 mb-4 text-3xl font-black md:text-5xl">
            Sana Uygun Planı Seç
          </h1>
          <p className="text-primary-600 text-lg dark:text-gray-400">
            İstediğin zaman iptal et. Taahhüt yok.
          </p>
        </div>

        {/* --- ABONELİK YÖNETİM BİLGİSİ (Varsa Göster) --- */}
        {subscription && (
          <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto mb-16 max-w-3xl">
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-6 backdrop-blur-sm md:flex-row md:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {subscription.paket.paket_adi} abonesisin
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aboneliğin şu anda aktif.
                  </p>
                </div>
              </div>

              <Link
                href="/profil/abonelik" // Profil altındaki abonelik sayfasına yönlendir
                className="group flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-black transition-all hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/20 active:scale-95"
              >
                <Settings size={18} />
                <span>Aboneliği Yönet</span>
              </Link>
            </div>
          </div>
        )}

        <Suspense fallback={<LoadingSpinner />}>
          <PricingGrid plans={plans} currentPlanId={currentPlanId} />
        </Suspense>

        <div className="text-primary-500 mt-16 text-center text-sm dark:text-gray-500">
          <p>
            * HD ve Ultra HD kullanılabilirliği internet hizmetinize ve cihaz
            özelliklerine bağlıdır.
            <br />
            Tüm içerikler tüm çözünürlüklerde mevcut olmayabilir.
          </p>
        </div>
      </div>
    </div>
  );
}
