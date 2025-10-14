import Image from "next/image";
import { macondo } from "../_lib/fonts";

const Kampanya = ({
  kampanyaDetaylari,
}: {
  kampanyaDetaylari: { fotograf: string };
}) => {
  const { fotograf } = kampanyaDetaylari;

  return (
    <div className="flex flex-col overflow-hidden rounded-l-lg sm:flex-row">
      <div className="relative aspect-video w-full sm:w-[70%]">
        <Image src={fotograf} alt="foto" fill />
      </div>
      <div className="bg-primary-800 cinema-box relative flex-1 border border-l-white sm:border-l-[4px] sm:border-l-gray-500">
        <span className="bg-primary-900 absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-b-[1px] sm:h-8 sm:w-8"></span>
        <span className="bg-primary-900 absolute bottom-0 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full border-t-[1px] sm:h-8 sm:w-8"></span>
        <span className="bg-primary-900 absolute right-0 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full border-l-[2px] sm:h-10 sm:w-10"></span>
        <span className="bg-primary-900 absolute right-0 bottom-0 h-6 w-6 translate-x-1/2 translate-y-1/2 rounded-full border-l-[2px] sm:h-10 sm:w-10"></span>
        <div>
          <p
            className={`p-4 text-center text-xl md:text-2xl ${macondo.className}`}
          >
            BILETCIM
          </p>
          <p className="p-2 text-sm md:text-base">
            Pazartesi ve Çarşamba günleri sinemaseverleri ödüllendiriyoruz! Tüm
            biletlerde %30 indirimle dilediğin filmi izle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Kampanya;
