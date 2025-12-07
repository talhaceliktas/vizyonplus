import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import supabaseServer from "@/lib/supabase/server";

// Bileşenler
import PaymentForm from "@/features/payment/components/PaymentForm";
import OrderSummary from "@/features/payment/components/OrderSummary";

// Servisler
import { getSubscriptionPlanById } from "@/features/subscriptions/services/subscriptionService";
import {
  getCurrentUserSubscription,
  UserSubscription,
} from "@features/subscriptions/services/subscriptionService";

interface PaymentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const supabase = await supabaseServer();

  // 1. Kullanıcıyı Kontrol Et
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris?next=/odeme");
  }

  // 2. Aktif Abonelik Kontrolü (Kritik Adım)
  const activeSubscription = await getCurrentUserSubscription(user.id);

  // EĞER ABONELİK VARSA: Uyarı Ekranını Göster ve işlemi durdur.
  if (activeSubscription) {
    return <ExistingSubscriptionAlert subscription={activeSubscription} />;
  }

  // --- Buradan sonrası standart ödeme akışı ---

  const resolvedSearchParams = await searchParams;
  const planId = Number(resolvedSearchParams.plan);

  if (!planId || isNaN(planId)) {
    redirect("/abonelikler");
  }

  const plan = await getSubscriptionPlanById(planId);

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
            <PaymentForm planId={plan.id} />

            {/* Güvenlik Logoları Süslemesi */}
            <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale md:justify-start">
              <div className="h-8 w-12 rounded bg-white/10"></div>
              <div className="h-8 w-12 rounded bg-white/10"></div>
              <div className="h-8 w-12 rounded bg-white/10"></div>
            </div>
          </div>

          {/* SAĞ: Özet */}
          <div className="lg:col-span-5">
            <OrderSummary plan={plan} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- YARDIMCI BİLEŞEN: Mevcut Abonelik Uyarısı ---
function ExistingSubscriptionAlert({
  subscription,
}: {
  subscription: UserSubscription;
}) {
  // Tarihi formatla
  const bitisTarihi = new Date(subscription.bitis_tarihi).toLocaleDateString(
    "tr-TR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-black px-4 text-center text-white">
      <div className="relative mb-8">
        {/* Arkadaki parlama efekti */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-xl"></div>

        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-500/30 bg-green-900/20 shadow-2xl">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
      </div>

      <h1 className="mb-2 text-3xl font-black md:text-4xl">
        Zaten Aktif Bir Aboneliğin Var!
      </h1>

      <p className="mb-8 max-w-lg text-lg text-gray-400">
        Şu anda{" "}
        <span className="font-bold text-white">
          {subscription.paket.paket_adi}
        </span>{" "}
        paketini kullanıyorsun. Aboneliğin{" "}
        <span className="text-white">{bitisTarihi}</span> tarihine kadar
        geçerli.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/profil"
          className="group flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 font-bold text-black transition-all hover:scale-105 hover:bg-green-400 active:scale-95"
        >
          <span>Profilime Git</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10"
        >
          <Home className="h-5 w-5" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>
    </div>
  );
}
