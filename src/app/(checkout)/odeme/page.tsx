import { redirect } from "next/navigation";
import PaymentForm from "@/features/payment/components/PaymentForm";
import OrderSummary from "@/features/payment/components/OrderSummary";
import { getSubscriptionPlanById } from "@/features/subscriptions/services/subscriptionService";

// Next.js 15+ için params Promise olabilir ama searchParams genellikle direkt erişilebilirdir.
// Ancak page props tipini doğru verelim.
interface PaymentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  // Await searchParams (Next.js 15)
  const resolvedSearchParams = await searchParams;
  const planId = Number(resolvedSearchParams.plan);

  // 1. ID Kontrolü: ID yoksa veya geçersizse geri at
  if (!planId || isNaN(planId)) {
    redirect("/abonelikler");
  }

  // 2. Veri Çekme: Paketi veritabanından bul
  const plan = await getSubscriptionPlanById(planId);

  // 3. Paket Bulunamadıysa: Geri at
  if (!plan) {
    redirect("/abonelikler");
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Başlık */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-white md:text-4xl">
            Güvenli Ödeme
          </h1>
          <p className="mt-2 text-gray-400">
            <span className="font-bold text-yellow-500">{plan.paket_adi}</span>{" "}
            aboneliğinizi başlatmak için bilgilerinizi tamamlayın.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* SOL: Ödeme Formu */}
          <div className="lg:col-span-7">
            {/* Form'a Plan ID'sini gönderiyoruz ki neyi ödediğini bilsin */}
            <PaymentForm planId={plan.id} />

            <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale md:justify-start">
              <div className="h-8 w-12 rounded bg-white/10"></div>
              <div className="h-8 w-12 rounded bg-white/10"></div>
              <div className="h-8 w-12 rounded bg-white/10"></div>
            </div>
          </div>

          {/* SAĞ: Özet */}
          <div className="lg:col-span-5">
            {/* Özete tüm plan objesini gönderiyoruz */}
            <OrderSummary plan={plan} />
          </div>
        </div>
      </div>
    </div>
  );
}
