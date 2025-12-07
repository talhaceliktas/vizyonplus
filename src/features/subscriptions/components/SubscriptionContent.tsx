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
  // Veriyi burada çekiyoruz (Sunucuda bekletir)
  const subscription = await getCurrentUserSubscription(userId);

  // Veri geldikten sonra durumu kontrol edip render ediyoruz
  if (subscription) {
    return (
      <div className="animate-in fade-in flex flex-col gap-8 duration-500 lg:flex-row">
        {/* SOL: PAKET KARTI */}
        <SubscriptionCard subscription={subscription} />

        {/* SAĞ: AKSİYONLAR */}
        <SubscriptionActions isRenewing={subscription.otomatik_yenileme} />
      </div>
    );
  }

  // Abonelik yoksa
  return (
    <div className="animate-in fade-in duration-500">
      <EmptySubscriptionState />
    </div>
  );
}
