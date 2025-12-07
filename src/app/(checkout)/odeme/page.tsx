import PaymentForm from "@/features/payment/components/PaymentForm";
import OrderSummary from "@/features/payment/components/OrderSummary";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Başlık */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-white md:text-4xl">
            Güvenli Ödeme
          </h1>
          <p className="mt-2 text-gray-400">
            Aboneliğinizi başlatmak için bilgilerinizi tamamlayın.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* SOL TARAF: Ödeme Formu (Geniş Alan) */}
          <div className="lg:col-span-7">
            <PaymentForm />

            {/* Güvenlik Rozetleri (Opsiyonel Süsleme) */}
            <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale md:justify-start">
              {/* Buraya Visa/Mastercard logoları SVG olarak eklenebilir */}
              <div className="h-8 w-12 rounded bg-white/10"></div>
              <div className="h-8 w-12 rounded bg-white/10"></div>
              <div className="h-8 w-12 rounded bg-white/10"></div>
            </div>
          </div>

          {/* SAĞ TARAF: Özet (Dar Alan) */}
          <div className="lg:col-span-5">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
