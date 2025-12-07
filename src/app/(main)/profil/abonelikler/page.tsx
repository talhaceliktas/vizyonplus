import { CreditCard } from "lucide-react";
import supabaseServer from "@/lib/supabase/server";
// Import yolunu servisi oluşturduğumuz yer ile eşleştirdim
import { getCurrentUserSubscription } from "@/features/subscriptions/services/subscriptionService";

// Bileşenler
import SubscriptionCard from "@/features/subscriptions/components/SubscriptionCard";
import SubscriptionActions from "@/features/subscriptions/components/SubscriptionActions";
import EmptySubscriptionState from "@/features/subscriptions/components/EmptySubscriptionState";

export default async function SubscriptionPage() {
  // 1. Kullanıcıyı ve Aboneliği Çek
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const subscription = await getCurrentUserSubscription(user.id);

  return (
    <div className="w-full flex-1">
      {/* --- BAŞLIK ALANI --- */}
      <div className="border-primary-800 mb-8 flex items-center gap-4 border-b pb-6">
        <div className="bg-primary-900 text-secondary-1 border-primary-700 flex h-12 w-12 items-center justify-center rounded-full border">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-primary-50 text-2xl font-bold md:text-3xl">
            Abonelik Durumu
          </h1>
          <p className="text-primary-400 text-sm md:text-base">
            Mevcut paketini görüntüle ve ödeme planını yönet.
          </p>
        </div>
      </div>

      {/* --- İÇERİK ALANI --- */}
      {subscription ? (
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* SOL: PAKET KARTI */}
          {/* Kart bileşeni tüm abonelik objesini alıyor */}
          <SubscriptionCard subscription={subscription} />

          {/* SAĞ: AKSİYONLAR */}
          {/* YENİ: Otomatik yenileme bilgisini prop olarak geçiyoruz */}
          <SubscriptionActions isRenewing={subscription.otomatik_yenileme} />
        </div>
      ) : (
        // --- BOŞ DURUM ---
        <EmptySubscriptionState />
      )}
    </div>
  );
}
