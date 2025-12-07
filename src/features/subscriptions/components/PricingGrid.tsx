import { AbonelikPaketi } from "@/types";
import PricingCard from "./PricingCard";

interface PricingGridProps {
  plans: AbonelikPaketi[];
  currentPlanId?: number | null;
}

export default function PricingGrid({
  plans,
  currentPlanId,
}: PricingGridProps) {
  const hasActiveSubscription = !!currentPlanId;

  return (
    <div className="grid gap-8 md:grid-cols-3 md:gap-4 lg:gap-12">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          isPopular={plan.paket_adi === "Standart"}
          isCurrent={currentPlanId === plan.id}
          hasActiveSubscription={hasActiveSubscription}
        />
      ))}
    </div>
  );
}
