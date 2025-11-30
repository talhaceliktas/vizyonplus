"use client";

import React, { useState, useTransition } from "react";
import {
  CheckCircle,
  Calendar,
  AlertTriangle,
  Loader2,
  Zap,
  Power,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { otomatikYenilemeDegistir } from "../../_lib/data-service-server";

export default function AbonelikYonetimi({ abonelik }) {
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<
    "reactivate" | "cancel" | null
  >(null);

  // Başlangıç durumu
  const [iptalSurecinde, setIptalSurecinde] = useState(
    !abonelik.otomatik_yenileme,
  );

  const bitisTarihi = new Date(abonelik.bitis_tarihi).toLocaleDateString(
    "tr-TR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  const handleReactivate = () => {
    setLoadingAction("reactivate");
    startTransition(async () => {
      const res = await otomatikYenilemeDegistir(abonelik.id, true);
      if (res.success) {
        toast.success("Aboneliğiniz tekrar aktif edildi! 🎉");
        setIptalSurecinde(false);
      } else {
        toast.error("İşlem başarısız oldu");
      }
      setLoadingAction(null);
    });
  };

  const handleCancel = () => {
    if (!confirm("Otomatik yenilemeyi kapatmak istediğinize emin misiniz?"))
      return;

    setLoadingAction("cancel");
    startTransition(async () => {
      const res = await otomatikYenilemeDegistir(abonelik.id, false);
      if (res.success) {
        toast.success("Otomatik yenileme kapatıldı");
        setIptalSurecinde(true);
      } else {
        toast.error("İşlem başarısız");
      }
      setLoadingAction(null);
    });
  };

  return (
    // WRAPPER: Light'ta açık gri (50), Dark'ta simsiyah (950)
    <div className="dark:bg-primary-950 flex min-h-[100vh] w-full items-center justify-center p-4 transition-colors duration-300">
      {/* CARD: Light'ta beyaz, Dark'ta çok koyu gri (900). Border ayarı da dinamik. */}
      <div className="border-primary-200 hover:shadow-secondary-500/10 dark:border-primary-800 dark:bg-primary-900 relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-white shadow-2xl transition-all duration-300">
        {/* --- ÜST KISIM: DURUM ÇİZGİSİ --- */}
        <div
          className={`absolute top-0 h-1.5 w-full transition-colors ${
            iptalSurecinde ? "bg-secondary-1-2" : "bg-green-500"
          }`}
        />

        {/* --- HEADER --- */}
        <div className="relative overflow-hidden p-8 pb-0">
          <div className="flex flex-col items-start justify-between gap-y-5 md:flex-row md:gap-y-0">
            <div>
              <div className="flex items-center gap-3">
                {iptalSurecinde ? (
                  // İKON ARKA PLANI: Light'ta daha belirgin, Dark'ta saydam
                  <div className="rounded-full bg-orange-100 p-2 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-500/10 dark:text-green-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                )}
                <div>
                  {/* BAŞLIK: Light'ta Koyu (900), Dark'ta Açık (50) */}
                  <h2 className="text-primary-100 dark:text-primary-50 text-xl font-bold">
                    {iptalSurecinde ? "Abonelik Sona Eriyor" : "Abonelik Aktif"}
                  </h2>
                  <p className="text-primary-500 dark:text-primary-400 text-sm">
                    {iptalSurecinde
                      ? "Dönem sonunda erişiminiz kesilecek."
                      : "Vizyon+ ayrıcalıkları devam ediyor."}
                  </p>
                </div>
              </div>
            </div>

            {/* FİYAT ALANI */}
            <div className="flex items-center gap-x-5 text-right md:block">
              <p className="text-primary-200 dark:text-primary-50 text-2xl font-black">
                {abonelik.abonelik_paketleri.fiyat} ₺
              </p>
              <p className="text-primary-500 dark:text-primary-400 text-xs">
                / Ay
              </p>
            </div>
          </div>
        </div>

        {/* --- ORTA KISIM: DETAYLAR --- */}
        <div className="mt-8 grid grid-cols-1 gap-4 px-8 pb-8 sm:grid-cols-2">
          {/* Paket Kartı */}
          <div className="bg-primary-900 hover:bg-primary-800 dark:bg-primary-800/50 dark:hover:bg-primary-800 flex flex-col justify-center rounded-2xl p-5 transition-colors">
            <span className="text-primary-400 dark:text-primary-500 text-xs font-bold tracking-wider uppercase">
              Paket
            </span>
            <div className="mt-2 flex items-center gap-2">
              <Zap
                className={"text-secondary-1 dark:text-secondary-1-2 h-5 w-5"}
              />
              <span className="text-secondary-1 dark:text-secondary-1-2 text-lg font-bold">
                {abonelik.abonelik_paketleri.paket_adi}
              </span>
            </div>
          </div>

          {/* Tarih Kartı */}
          <div className="bg-primary-900 hover:bg-primary-800 dark:bg-primary-800/50 dark:hover:bg-primary-800 flex flex-col justify-center rounded-2xl p-5 transition-colors">
            <span className="text-primary-400 dark:text-primary-500 text-xs font-bold tracking-wider uppercase">
              {iptalSurecinde ? "Bitiş Tarihi" : "Yenilenme Tarihi"}
            </span>
            <div className="mt-2 flex items-center gap-2">
              <Calendar className="text-secondary-1 dark:text-secondary-1-2 h-5 w-5" />
              <span className={"text-secondary-1 text-lg font-bold"}>
                {bitisTarihi}
              </span>
            </div>
          </div>
        </div>

        {/* --- ALT KISIM: AKSİYONLAR --- */}
        <div className="border-primary-100 bg-primary-900 dark:border-primary-800 border-t p-6 dark:bg-black/20">
          {iptalSurecinde ? (
            /* --- TEKRAR BAŞLAT --- */
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-primary-50 dark:text-primary-400 text-sm">
                Fikrinizi mi değiştirdiniz? Kaldığınız yerden devam edin.
              </p>
              <button
                onClick={handleReactivate}
                disabled={isPending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-green-600 transition-all hover:border-green-300 hover:bg-red-50 active:scale-95 disabled:opacity-50 sm:w-auto dark:border-green-500/20 dark:text-green-500 dark:hover:border-green-500/50 dark:hover:bg-green-500/10"
              >
                {loadingAction === "reactivate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">
                      Aboneliği Tekrar Başlat
                    </span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* --- İPTAL ET --- */
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-primary-500 dark:text-primary-500 text-xs">
                Otomatik ödeme açıktır. Dilediğiniz zaman durdurabilirsiniz.
              </p>
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:border-red-300 hover:bg-red-50 active:scale-95 disabled:opacity-50 sm:w-auto dark:border-red-500/20 dark:text-red-500 dark:hover:border-red-500/50 dark:hover:bg-red-500/10"
              >
                {loadingAction === "cancel" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Power className="h-4 w-4" />
                    <span>Otomatik Ödemeyi Kapat</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
