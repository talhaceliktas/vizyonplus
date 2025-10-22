import Image from "next/image";

import Link from "next/link";

const KayitTamamlandi = ({ gonderilenEmail }: { gonderilenEmail: string }) => {
  return (
    <div className="border-primary-800/50 backd bg-primary-700/70 flex flex-col items-center gap-y-14 rounded-2xl border-[1px] p-8 shadow-2xl backdrop-blur-sm">
      <div className="relative aspect-[4/1] h-16">
        <Image src="/logo.png" alt="Biletcim logosu" fill />
      </div>
      <div className="flex flex-col gap-y-1 text-center">
        <p>Hesabın başarıyla oluşturuldu!</p>
        <p>
          <span className="text-secondary-1 underline">{gonderilenEmail}</span>{" "}
          adresine bir doğrulama bağlantısı gönderdik.
        </p>
        <p>Lütfen e-postanı kontrol et ve hesabını etkinleştir. 📩</p>
      </div>
      <Link href="/giris" className="text-primary-50 text-lg">
        Giriş Yap
      </Link>
    </div>
  );
};

export default KayitTamamlandi;
