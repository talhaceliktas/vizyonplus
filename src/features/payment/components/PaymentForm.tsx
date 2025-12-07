"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createMockSubscription } from "../actions/payment-actions";
// Yeni oluşturduğumuz reusable componenti import et
import CreditCardForm from "../../../shared/components/ui/CreditCardForm";

interface PaymentFormProps {
  planId: number;
}

export default function PaymentForm({ planId }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // İş mantığı burada
  const handlePaymentSubmit = async () => {
    setLoading(true);

    try {
      // 1. Yapay gecikme (Banka onayı hissi)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 2. Server Action
      const res = await createMockSubscription(planId);

      if (res.success) {
        toast.success("Ödeme başarılı! Aboneliğiniz başlatıldı. 🎉");
        router.push("/profil");
      } else {
        toast.error(res.error || "Ödeme sırasında bir hata oluştu.");
      }
    } catch (error) {
      toast.error("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // Sadece mantığı ve prop'ları geçiriyoruz
  return (
    <CreditCardForm
      onSubmit={handlePaymentSubmit}
      isLoading={loading}
      buttonText="Ödemeyi Tamamla"
    />
  );
}
