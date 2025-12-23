/**
 * Bu bileşen, kullanıcının abonelik detaylarını gösteren ana kapsayıcıdır.
 * Sunucu Bileşenidir (Server Component).
 * Veritabanından kullanıcının abonelik bilgisini çeker.
 * - Abonelik varsa: Detay kartını (`SubscriptionCard`) ve yönetim butonlarını (`SubscriptionActions`) gösterir.
 * - Abonelik yoksa: Boş durum bileşenini (`EmptySubscriptionState`) gösterir.
 */

import { getCurrentUserSubscription } from "../services/subscriptionService";
import SubscriptionCard from "@/features/subscriptions/components/SubscriptionCard";
import SubscriptionActions from "@/features/subscriptions/components/SubscriptionActions";
import EmptySubscriptionState from "@/features/subscriptions/components/EmptySubscriptionState";

interface SubscriptionContentProps {
  userId: string;
}

export default async function SubscriptionContent({
  userId,
}: SubscriptionContentProps) {
  // Veriyi burada çekiyoruz (Sunucu tarafında çalışır ve bekler)
  const subscription = await getCurrentUserSubscription(userId);

  // Veri geldikten sonra durumu kontrol edip render ediyoruz
  if (subscription) {
    return (
      <div className="animate-in fade-in flex flex-col gap-8 duration-500 lg:flex-row">
        {/* SOL: PAKET DETAY KARTI */}
        <SubscriptionCard subscription={subscription} />

        {/* SAĞ: YÖNETİM AKSİYONLARI (İptal/Yenile/Değiştir) */}
        <SubscriptionActions isRenewing={subscription.otomatik_yenileme} />
      </div>
    );
  }

  // Eğer aktif bir abonelik yoksa
  return (
    <div className="animate-in fade-in duration-500">
      <EmptySubscriptionState />
    </div>
  );
}
