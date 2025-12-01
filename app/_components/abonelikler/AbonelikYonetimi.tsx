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
    // WRAPPER: Koyu arka plan
    <div className="flex w-full items-center justify-center p-4">
      {/* ANA KART: Koyu gri zemin, hafif border */}
      <div className="border-primary-800 bg-primary-900 hover:shadow-secondary-1/5 relative w-full overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300">
        {/* --- ÜST KISIM: DURUM ÇİZGİSİ --- */}
        <div
          className={`absolute top-0 h-1.5 w-full transition-colors ${
            iptalSurecinde ? "bg-red-500" : "bg-green-500"
          }`}
        />

        {/* --- HEADER --- */}
        <div className="relative overflow-hidden p-8 pb-0">
          <div className="flex flex-col items-start justify-between gap-y-5 md:flex-row md:gap-y-0">
            <div>
              <div className="flex items-center gap-4">
                {iptalSurecinde ? (
                  <div className="rounded-full border border-red-500/20 bg-red-500/10 p-3 text-red-500">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="rounded-full border border-green-500/20 bg-green-500/10 p-3 text-green-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <h2 className="text-primary-50 text-xl font-bold">
                    {iptalSurecinde ? "Abonelik Sona Eriyor" : "Abonelik Aktif"}
                  </h2>
                  <p className="text-primary-400 mt-1 text-sm">
                    {iptalSurecinde
                      ? "Dönem sonunda erişiminiz kesilecek."
                      : "Vizyon+ ayrıcalıkları devam ediyor."}
                  </p>
                </div>
              </div>
            </div>

            {/* FİYAT ALANI */}
            <div className="flex items-center gap-x-2 text-right md:block">
              <p className="text-primary-50 text-2xl font-black">
                {abonelik.abonelik_paketleri.fiyat} ₺
              </p>
              <p className="text-primary-500 text-xs font-medium tracking-wider uppercase">
                / Ay
              </p>
            </div>
          </div>
        </div>

        {/* --- ORTA KISIM: DETAY KARTLARI --- */}
        <div className="mt-8 grid grid-cols-1 gap-4 px-8 pb-8 sm:grid-cols-2">
          {/* Paket Kartı */}
          <div className="border-primary-800 bg-primary-950/50 hover:bg-primary-800/50 flex flex-col justify-center rounded-2xl border p-5 transition-colors">
            <span className="text-primary-500 text-xs font-bold tracking-wider uppercase">
              Paket
            </span>
            <div className="mt-2 flex items-center gap-2">
              <Zap className="text-secondary-1 h-5 w-5" />
              <span className="text-primary-50 text-lg font-bold">
                {abonelik.abonelik_paketleri.paket_adi}
              </span>
            </div>
          </div>

          {/* Tarih Kartı */}
          <div className="border-primary-800 bg-primary-950/50 hover:bg-primary-800/50 flex flex-col justify-center rounded-2xl border p-5 transition-colors">
            <span className="text-primary-500 text-xs font-bold tracking-wider uppercase">
              {iptalSurecinde ? "Bitiş Tarihi" : "Yenilenme Tarihi"}
            </span>
            <div className="mt-2 flex items-center gap-2">
              <Calendar className="text-secondary-1 h-5 w-5" />
              <span
                className={`text-lg font-bold ${iptalSurecinde ? "text-red-400" : "text-primary-50"}`}
              >
                {bitisTarihi}
              </span>
            </div>
          </div>
        </div>

        {/* --- ALT KISIM: AKSİYONLAR --- */}
        <div className="border-primary-800 bg-primary-950/30 border-t p-6">
          {iptalSurecinde ? (
            /* --- DURUM: İPTAL EDİLMİŞ (TEKRAR BAŞLAT) --- */
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-primary-50 font-bold">
                  Ayrıcalıklarını kaybetme! 🌟
                </p>
                <p className="text-primary-400 text-sm">
                  Hemen şimdi kaldığın yerden devam et.
                </p>
              </div>

              <button
                onClick={handleReactivate}
                disabled={isPending}
                className="from-secondary-1 to-secondary-2 shadow-secondary-1/20 hover:shadow-secondary-1/40 relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r px-8 py-3.5 font-bold text-black shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loadingAction === "reactivate" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
                    <span>Aboneliği Tekrar Başlat</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* --- DURUM: AKTİF (İPTAL ETME SEÇENEĞİ) --- */
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-primary-500 text-xs">
                Otomatik ödeme açıktır. Dilediğiniz zaman durdurabilirsiniz.
              </p>
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-500 transition-all hover:border-red-500/50 hover:bg-red-500/10 active:scale-95 disabled:opacity-50 sm:w-auto"
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
