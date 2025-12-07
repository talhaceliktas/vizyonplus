import { Suspense } from "react";
import { CreditCard } from "lucide-react";
import supabaseServer from "@/lib/supabase/server";

import SubscriptionContent from "@/features/subscriptions/components/SubscriptionContent";
import SubscriptionPageSkeleton from "@/features/subscriptions/components/skeletons/SubscriptionPageSkeleton";

export default async function SubscriptionPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="w-full flex-1">
      {/* --- BAŞLIK ALANI (Statik - Anında Yüklenir) --- */}
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

      {/* --- İÇERİK ALANI (Streaming - Yüklenirken Skeleton Gösterir) --- */}
      <Suspense fallback={<ContentSkeletonWrapper />}>
        <SubscriptionContent userId={user.id} />
      </Suspense>
    </div>
  );
}

function ContentSkeletonWrapper() {
  return (
    <div className="-mt-[120px] overflow-hidden">
      <SubscriptionPageSkeleton />
    </div>
  );
}
