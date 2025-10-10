import Image from "next/image";
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";

import marvelBanner from "../../public/marvelBanner.jpg";
import marvelLogo from "../../public/marvelLogo.png";

const Intro = () => {
  return (
    <div className="relative">
      <div className="h-screen">
        <Image
          src={marvelBanner}
          fill
          alt="Marvel Banneri"
          className="object-cover opacity-60"
        />
        <div className="bg-primary-800/5 absolute top-1/2 ml-5 -translate-y-1/2 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] md:ml-40">
          <div className="relative h-[7rem] w-[14rem] md:h-[15rem] md:w-[30rem]">
            <Image
              src={marvelLogo}
              fill
              alt="Marvel Logosu"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-x-5 gap-y-2 text-sm md:flex-row md:gap-y-0 md:text-base">
            <h3>Aksiyon | Macera | Bilim Kurgu</h3>
            <div className="flex gap-x-5">
              <p className="flex items-center gap-x-2">
                <MdOutlineDateRange />
                2018
              </p>
              <p className="flex items-center gap-x-2">
                <FaRegClock />
                2s 23dk
              </p>
            </div>
          </div>
          <hr className="text-primary-50 my-3" />
          <p className="w-[14rem] px-1 md:w-[30rem]">
            Marvel Sinematik Evreni’nin en büyük buluşması! Avengers: Endgame,
            Thanos’un evrenin yarısını yok etmesinin ardından kalan
            kahramanların son bir umutla mücadelesini konu alıyor. Zaman,
            fedakârlık ve dostluk üzerine kurulu bu destansı final; duygusal
            anları, etkileyici görsel efektleri ve unutulmaz sahneleriyle
            izleyicileri büyülüyor.
          </p>
          <button className="bg-primary-600 hover:bg-primary-500 mt-5 flex transform cursor-pointer items-center gap-x-2 rounded-4xl px-7 py-3 duration-300 hover:scale-x-[1.15] hover:scale-y-[1.15] hover:gap-x-4">
            Filme Git
            <HiArrowNarrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
