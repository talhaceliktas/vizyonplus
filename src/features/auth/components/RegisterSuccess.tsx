/**
 * Bu bileşen, başarılı bir kayıt işleminden sonra gösterilen onay ekranıdır.
 * Kullanıcıya e-posta doğrulama linkinin gönderildiğini bildirir.
 */

import Image from "next/image";
import Link from "next/link";

const RegisterSuccess = ({ gonderilenEmail }: { gonderilenEmail: string }) => {
  return (
    <div className="border-primary-800/50 bg-primary-700/70 text-primary-50 animate-in fade-in zoom-in flex flex-col items-center gap-y-14 rounded-2xl border p-8 shadow-2xl backdrop-blur-sm duration-500">
      <div className="relative aspect-4/1 h-16">
        <Image
          src="/logo.png"
          alt="Vizyon Plus logosu"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col gap-y-1 text-center">
        <p className="text-xl font-semibold">Hesabın başarıyla oluşturuldu!</p>
        <p>
          <span className="text-secondary-1 font-bold underline">
            {gonderilenEmail}
          </span>{" "}
          adresine bir doğrulama bağlantısı gönderdik.
        </p>
        <p className="opacity-80">
          Lütfen e-postanı kontrol et ve hesabını etkinleştir. 📩
        </p>
      </div>
      <Link
        href="/giris"
        className="bg-primary-600 hover:bg-primary-700 rounded-lg px-8 py-3 font-semibold text-white transition-colors"
      >
        Giriş Yap
      </Link>
    </div>
  );
};

export default RegisterSuccess;
