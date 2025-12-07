import { Calendar, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { UserSubscription } from "../services/subscriptionService";

interface SubscriptionCardProps {
  subscription: UserSubscription;
}

export default function SubscriptionCard({
  subscription,
}: SubscriptionCardProps) {
  // Abonelik durumu kontrolü
  // otomatik_yenileme TRUE ise -> Devam ediyor (Aktif)
  // otomatik_yenileme FALSE ise -> İptal edilmiş ama süresi var (Sona Eriyor)
  const isRenewing = subscription.otomatik_yenileme;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="border-primary-800 bg-primary-900/30 flex-1 overflow-hidden rounded-2xl border">
      {/* Header */}
      <div className="border-primary-800 flex flex-wrap items-center justify-between gap-4 border-b bg-white/5 p-6 md:p-8">
        <div>
          <span className="text-primary-400 text-xs font-bold tracking-wider uppercase">
            Mevcut Plan
          </span>
          <h2 className="text-secondary-1 mt-1 text-3xl font-black">
            {subscription.paket.paket_adi}
          </h2>
        </div>

        {/* DURUM ROZETİ */}
        {isRenewing ? (
          // DURUM: AKTİF
          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-sm font-bold text-green-500">
            <CheckCircle2 size={16} />
            <span>Aktif</span>
          </div>
        ) : (
          // DURUM: SONA ERİYOR (İptal Edilmiş)
          <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1.5 text-sm font-bold text-yellow-500">
            <Clock size={16} />
            <span>Sona Eriyor</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 md:p-8">
        <div className="mb-8 flex items-baseline gap-2">
          <span className="text-primary-50 text-4xl font-bold">
            {subscription.paket.fiyat} ₺
          </span>
          <span className="text-primary-500">/ ay</span>
        </div>

        {/* UYARI MESAJI (Sadece İptal edildiyse görünür) */}
        {!isRenewing && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-yellow-500">
            <AlertTriangle size={20} className="shrink-0" />
            <div className="text-sm">
              <p className="font-bold">Aboneliğin iptal edildi.</p>
              <p className="opacity-80">
                <span className="font-bold">
                  {formatDate(subscription.bitis_tarihi)}
                </span>{" "}
                tarihine kadar izlemeye devam edebilirsin. Bu tarihten sonra
                ödeme alınmayacak.
              </p>
            </div>
          </div>
        )}

        {/* Tarih Bilgileri */}
        <div className="bg-primary-900 mb-8 grid gap-4 rounded-xl p-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="bg-primary-800 text-primary-200 flex h-8 w-8 items-center justify-center rounded-lg">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-primary-400 text-xs">Başlangıç</p>
              <p className="text-primary-50 text-sm font-medium">
                {formatDate(subscription.baslangic_tarihi)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary-800 text-primary-200 flex h-8 w-8 items-center justify-center rounded-lg">
              <Calendar size={16} />
            </div>
            <div>
              {/* Başlık Duruma Göre Değişir */}
              <p className="text-primary-400 text-xs">
                {isRenewing ? "Yenilenme Tarihi" : "Bitiş Tarihi"}
              </p>
              <p
                className={`text-sm font-medium ${isRenewing ? "text-primary-50" : "text-yellow-500"}`}
              >
                {formatDate(subscription.bitis_tarihi)}
              </p>
            </div>
          </div>
        </div>

        {/* Özellikler */}
        <div className="space-y-3">
          <p className="text-primary-400 text-sm font-medium">
            Paket Özellikleri:
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {subscription.paket.ozellikler
              .filter((oz) => oz.included)
              .map((ozellik, i) => (
                <li
                  key={i}
                  className="text-primary-300 flex items-center gap-2 text-sm"
                >
                  <CheckCircle2
                    size={14}
                    className="text-secondary-1 shrink-0"
                  />
                  {ozellik.text}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
