import Image from "next/image";
import { Calendar, Clock, Clapperboard } from "lucide-react"; // İkonlar
import { Table } from "@/types"; // Tip yolunu kontrol et

interface ContentHeroProps {
  content: Table<"icerikler">;
}

export default function ContentHero({ content }: ContentHeroProps) {
  // Yıl bilgisi
  const releaseYear = new Date(content.yayinlanma_tarihi).getFullYear();

  return (
    <div className="flex flex-col gap-x-10 gap-y-10 md:flex-row">
      {/* --- SOL: POSTER --- */}
      <div className="group relative aspect-9/16 w-full max-w-[350px] shrink-0 overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.01] md:max-w-[400px]">
        {/* Gölge Efekti */}
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <Image
          alt={`${content.isim} posteri`}
          src={content.fotograf}
          className="object-cover"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* --- SAĞ: BİLGİLER --- */}
      <div className="flex w-full flex-col justify-center gap-y-6">
        <div>
          {/* Başlık */}
          <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            {content.isim}
          </h1>

          {/* Meta Veriler (Yıl, Süre, Tür) */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-gray-600 sm:text-base dark:text-gray-300">
            {/* İçerik Türü Rozeti (FİLM / DİZİ) */}
            <span className="flex items-center gap-1.5 rounded bg-gray-200 px-2 py-0.5 text-xs font-bold tracking-wider text-gray-800 uppercase dark:bg-white/20 dark:text-white">
              <Clapperboard size={14} />
              {content.tur}
            </span>

            {/* Ayıraç */}
            <span className="hidden text-gray-300 sm:inline dark:text-gray-600">
              •
            </span>

            {/* Yıl */}
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-yellow-500" />
              <span>{releaseYear}</span>
            </div>

            {/* Süre */}
            {content.sure && (
              <>
                <span className="hidden text-gray-300 sm:inline dark:text-gray-600">
                  •
                </span>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-yellow-500" />
                  <span>{content.sure} dk</span>
                </div>
              </>
            )}
          </div>

          {/* TÜRLER (GENRES) */}
          {content.turler && content.turler.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {content.turler.map((tur: string, index: number) => (
                <span
                  key={index}
                  className="rounded-full border border-gray-300 bg-transparent px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-yellow-500 hover:text-yellow-600 dark:border-white/10 dark:text-gray-400 dark:hover:border-yellow-500 dark:hover:text-yellow-500"
                >
                  {tur}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Açıklama */}
        <p className="max-w-3xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          {content.aciklama}
        </p>

        {/* Ekstra Bilgiler (Yönetmen / Oyuncular vb.) */}
        <div className="flex flex-col gap-2 border-l-4 border-yellow-500 pl-4">
          {content.yonetmen && (
            <div className="text-sm">
              <span className="font-bold text-gray-900 dark:text-gray-200">
                Yönetmen:
              </span>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {content.yonetmen}
              </span>
            </div>
          )}

          {/* İleride oyuncular eklenirse buraya gelir */}
          {/* <div className="text-sm">
                <span className="font-bold text-gray-900 dark:text-gray-200">Oyuncular:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">Haluk Bilginer, Cansu Dere...</span>
            </div> */}
        </div>
      </div>
    </div>
  );
}
