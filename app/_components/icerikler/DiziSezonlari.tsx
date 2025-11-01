"use client";

const DiziSezonlari = ({ diziSezonBilgileri, seciliSezon, setSeciliSezon }) => {
  if (!diziSezonBilgileri || diziSezonBilgileri.length === 0) return null;

  return (
    <div className="flex flex-col gap-y-4">
      {diziSezonBilgileri.map((sezon) => (
        <button
          key={sezon.sezon_numarasi}
          onClick={() => setSeciliSezon(sezon.sezon_numarasi)}
          className={`hover:bg-primary-600 cursor-pointer px-4 py-2 text-left text-lg duration-300 ${sezon.sezon_numarasi === seciliSezon ? "opacity-100" : "opacity-65"}`}
        >
          SEZON {sezon.sezon_numarasi}
        </button>
      ))}
    </div>
  );
};

export default DiziSezonlari;
