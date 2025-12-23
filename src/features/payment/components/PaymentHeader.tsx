/**
 * Ödeme sayfasının üst kısmında görünen başlık ve açıklama bileşeni.
 * Satın alma türüne (Yükseltme veya Yeni Abonelik) göre metni dinamikleştirir.
 */

interface Props {
  planName: string; // Seçilen planın adı
  isUpgrade: boolean; // İşlem bir yükseltme (upgrade) işlemi mi?
}

export default function PaymentHeader({ planName, isUpgrade }: Props) {
  return (
    <div className="mb-10 text-center md:text-left">
      <h1 className="text-3xl font-black text-white md:text-4xl">
        Güvenli Ödeme
      </h1>
      <p className="mt-2 text-gray-400">
        <span className="font-bold text-yellow-500">{planName}</span>{" "}
        aboneliğinizi {isUpgrade ? "başlatmak" : "satın almak"} için
        bilgilerinizi tamamlayın.
      </p>
    </div>
  );
}
