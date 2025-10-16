import Image from "next/image";
import biletcimLogo from "../../public/logo.png";

const Footer = () => {
  return (
    <div className="p-20 pb-6">
      <div className="mt-40 grid grid-cols-7 gap-x-4 gap-y-10 md:gap-y-0">
        <div className="col-start-1 col-end-8 md:col-end-3 flex flex-col gap-y-4">
          <div className="aspect-[4/1] w-40">
            <Image src={biletcimLogo} alt="Biletcim Logosu" />
          </div>
          <p>
            Biletcim, sinema keyfini kolay ve hızlı yaşamanız için tasarlanmış
            modern bir bilet platformudur. Türkiye genelindeki salonları tek
            çatı altında toplar, seansları keşfetmenizi ve yerinizi anında
            ayırtmanızı sağlar. Kullanıcı dostu arayüzüyle her cihazdan güvenli,
            hızlı ve keyifli bir deneyim sunar.
          </p>
        </div>
        <div className="md:col-start-6 col-start-1 flex h-full w-full flex-col gap-y-2">
          <h3 className="mb-1 font-bold">Kurumsal</h3>
          <p className="cursor-pointer text-sm hover:underline">Hakkımızda</p>
          <p className="cursor-pointer text-sm hover:underline">Bize Ulaş</p>
          <p className="cursor-pointer text-sm hover:underline">
            Gizlilik Sözleşmesi
          </p>
          <p className="cursor-pointer text-sm hover:underline">KVKK</p>
        </div>
        <div className=" col-end-8 col-start-5 md:col-start-7 flex h-full w-full flex-col gap-y-2">
          <h3 className="mb-1 font-bold">İletişim</h3>
          <a
            className="cursor-pointer text-sm hover:underline"
            href="tel:+1-234-567-890"
          >
            +1-234-567-890
          </a>
          <a
            className="cursor-pointer text-sm hover:underline"
            href="mailto:iletisim@biletcim.com"
          >
            iletisim@biletcim.com
          </a>
          <p className="text-sm">
            Gülbahar Mahallesi, Lavanta Sokak No: 27, Meram / Konya, Türkiye
          </p>
        </div>
      </div>
      <hr className="mt-10" />
      <p className="mt-2 text-center">
        🎬 Biletcim, tamamen deneysel amaçla geliştirilmiş bir sinema
        rezervasyon projesidir. Gerçek bilet satışı veya ticari bir faaliyet
        yürütmemektedir. Tüm içerikler, kullanıcı arayüzü ve veriler yalnızca
        eğitim ve demo amaçlı hazırlanmıştır. © 2025 Biletcim – Bu proje,
        yazılım geliştirme sürecinde öğrenme ve deneme çalışmasıdır.
      </p>
    </div>
  );
};

export default Footer;
