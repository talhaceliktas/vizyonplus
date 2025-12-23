"use client";

/**
 * Bu bileşen, abonelik yönetimi için aksiyon butonlarını (İptal Et, Yenile, Plan Değiştir) içerir.
 * İşlemlerden önce kullanıcıdan onay almak için `ConfirmationModal` kullanır.
 * İstemci tarafında çalışır (use client) çünkü kullanıcı etkileşimi ve state yönetimi gerektirir.
 */

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, RefreshCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { toggleSubscriptionRenewal } from "@/features/subscriptions/actions/subscription-actions";

// Yeni importlar
import useClickOutside from "@shared/hooks/useClickOutside";
import ConfirmationModal from "@shared/components/ui/ConfirmationModal";

interface SubscriptionActionsProps {
  isRenewing: boolean; // Abonelik şu an otomatik yenilenme modunda mı?
}

export default function SubscriptionActions({
  isRenewing,
}: SubscriptionActionsProps) {
  const [loading, setLoading] = useState(false);

  // 1. Ref oluşturuyoruz (Modal kutusunun referansı, dışarı tıklama tespiti için)
  const modalRef = useRef<HTMLDivElement>(null);

  // 2. Custom Hook'u kullanıyoruz (Modalın açık/kapalı durumunu yönetir)
  const { isOpen, setIsOpen } = useClickOutside(modalRef);

  /**
   * Modaldaki "Onayla" butonuna basınca çalışır.
   * Abonelik yenileme durumunu tersine çevirir (İptalse Aktif eder, Aktifse İptal eder).
   */
  const handleConfirmAction = async () => {
    setLoading(true);
    try {
      const res = await toggleSubscriptionRenewal();
      if (res.success) {
        toast.success(res.message ?? "İşlem başarılı!");
        setIsOpen(false); // Başarılı işlem sonrası modalı kapat
      } else {
        toast.error(res.error || "Bir hata oluştu.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  // Butona basınca modalı açan fonksiyon
  const handleOpenModal = () => setIsOpen(true);

  // Modal içeriğini mevcut duruma göre (İptal mi Yenileme mi?) hazırla
  const modalContent = isRenewing
    ? {
        title: "Aboneliği İptal Et",
        message:
          "Aboneliğini iptal etmek üzeresin. Dönem sonuna kadar izlemeye devam edebileceksin ancak sonraki ay yenilenmeyecek. Emin misin?",
        confirmText: "Evet, İptal Et",
        variant: "danger" as const, // Tehlikeli işlem (Kırmızı)
      }
    : {
        title: "Aboneliği Yenile",
        message:
          "Aboneliğini tekrar başlatmak üzeresin. Kartından bir sonraki dönemde otomatik çekim yapılacak. Onaylıyor musun?",
        confirmText: "Yenile ve Devam Et",
        variant: "success" as const, // Olumlu işlem (Yeşil)
      };

  return (
    <>
      {/* --- ONAY MODALI --- */}
      <ConfirmationModal
        ref={modalRef} // Hook'un takip edeceği ref
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirmAction}
        loading={loading}
        title={modalContent.title}
        message={modalContent.message}
        confirmText={modalContent.confirmText}
        variant={modalContent.variant}
      />

      {/* --- ANA İÇERİK (BUTONLAR) --- */}
      <div className="flex w-full flex-col gap-6 lg:w-80">
        {/* 1. Plan Yükseltme/Değiştirme Kartı */}
        <div className="border-primary-800 bg-primary-900/30 rounded-xl border p-6">
          <h3 className="text-primary-50 mb-2 font-bold">Planı Değiştir</h3>
          <p className="text-primary-400 mb-6 text-sm">
            Daha fazla özellik için paketinizi yükseltebilirsiniz.
          </p>
          <Link
            href="/abonelikler"
            className="bg-primary-50 text-primary-950 hover:bg-secondary-1 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold transition-colors"
          >
            Planları İncele <ArrowRight size={16} />
          </Link>
        </div>

        {/* 2. İptal Etme veya Yeniden Başlatma Kartı */}
        {isRenewing ? (
          // DURUM: AKTİF -> İptal Etme Seçeneği Göster
          <div className="border-primary-800 bg-primary-900/30 rounded-xl border p-6">
            <div className="mb-2 flex items-center gap-2 text-red-400">
              <AlertTriangle size={18} />
              <h3 className="font-bold">Aboneliği İptal Et</h3>
            </div>
            <p className="text-primary-400 mb-6 text-sm">
              İptal ederseniz, dönem sonuna kadar izlemeye devam edebilirsiniz.
            </p>
            <button
              onClick={handleOpenModal} // Modalı açar
              className="border-primary-700 text-primary-400 flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-bold transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
            >
              İptal Et
            </button>
          </div>
        ) : (
          // DURUM: İPTAL EDİLMİŞ -> Geri Alma (Yenileme) Seçeneği Göster
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
            <div className="mb-2 flex items-center gap-2 text-green-500">
              <RefreshCcw size={18} />
              <h3 className="font-bold">Fikrini mi Değiştirdin?</h3>
            </div>
            <p className="text-primary-400 mb-6 text-sm">
              Aboneliğini tekrar aktif hale getirerek kesintisiz izlemeye devam
              et.
            </p>
            <button
              onClick={handleOpenModal} // Modalı açar
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-500"
            >
              Aboneliği Devam Ettir
            </button>
          </div>
        )}
      </div>
    </>
  );
}
