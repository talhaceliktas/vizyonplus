"use client";

/**
 * Bu bileşen, kullanıcının kredi kartı bilgilerini girip ödemeyi tamamladığı formdur.
 * `CreditCardForm` adlı yeniden kullanılabilir bileşeni kullanır.
 * Ödeme işlemini sunucu eylemi (`createMockSubscription`) ile gerçekleştirir.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createMockSubscription } from "../actions/payment-actions";
// Shared UI bileşeninden form yapısını alıyoruz
import CreditCardForm from "../../../shared/components/ui/CreditCardForm";

interface PaymentFormProps {
  planId: number; // Satın alınacak planın ID'si
}

export default function PaymentForm({ planId }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Form gönderildiğinde çalışan fonksiyon.
   * Ödeme simülasyonu yapar ve başarılıysa kullanıcıyı profile yönlendirir.
   */
  const handlePaymentSubmit = async () => {
    setLoading(true);

    try {
      // 1. Yapay gecikme (Gerçek bir banka POS işlemi gibi hissettirmek için)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 2. Server Action çağrısı (Ödeme işlemini ve veritabanı kaydını yapar)
      const res = await createMockSubscription(planId);

      if (res.success) {
        toast.success("Ödeme başarılı! Aboneliğiniz başlatıldı. 🎉");
        router.push("/profil"); // Başarılı işlem sonrası yönlendirme
      } else {
        toast.error(res.error || "Ödeme sırasında bir hata oluştu.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // UI'ı `CreditCardForm` bileşenine devrediyoruz, sadece mantığı (onSubmit) bağlıyoruz.
  return (
    <CreditCardForm
      onSubmit={handlePaymentSubmit}
      isLoading={loading}
      buttonText="Ödemeyi Tamamla"
    />
  );
}
