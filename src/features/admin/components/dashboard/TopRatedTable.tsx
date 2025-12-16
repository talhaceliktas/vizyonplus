import Image from "next/image";
import { Star, Trophy } from "lucide-react";
import { ContentRatingStats } from "../../services/statsService";

export default function TopRatedTable({
  data,
}: {
  data: ContentRatingStats[];
}) {
  return (
    <div className="border-primary-700 bg-primary-800/40 flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm backdrop-blur-sm">
      {/* Header Alanı */}
      <div className="border-primary-700/50 border-b p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-primary-50 text-lg font-semibold">
              En Yüksek Puanlı İçerikler
            </h3>
            <p className="text-primary-400 mt-1 text-sm">
              Kullanıcı oylarına göre en iyi performans gösterenler.
            </p>
          </div>
          <div className="bg-secondary-2/10 rounded-lg p-2">
            <Star className="text-secondary-2 h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tablo Alanı */}
      <div className="overflow-x-auto">
        <table className="text-primary-300 w-full text-left text-sm">
          <thead className="bg-primary-900/20 text-primary-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">İçerik</th>
              <th className="px-6 py-4 font-semibold tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 font-semibold tracking-wider">Puan</th>
              <th className="px-6 py-4 text-right font-semibold tracking-wider">
                Oylayan
              </th>
            </tr>
          </thead>
          <tbody className="divide-primary-700/50 divide-y">
            {data.map((item, index) => (
              <tr
                key={item.contentId}
                className="group hover:bg-primary-700/30 transition-colors"
              >
                {/* İsim ve Görsel Alanı */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-700 ring-primary-600/50 relative h-14 w-10 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="40px"
                        />
                      ) : (
                        <div className="text-primary-500 flex h-full w-full items-center justify-center text-xs">
                          ?
                        </div>
                      )}
                      {/* Sıralama Rozeti (Opsiyonel Şıklık) */}
                      <div className="absolute top-0 left-0 bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                        #{index + 1}
                      </div>
                    </div>
                    <span className="text-primary-100 line-clamp-1 font-medium transition-colors group-hover:text-white">
                      {item.title}
                    </span>
                  </div>
                </td>

                {/* Tür Alanı */}
                <td className="px-6 py-4">
                  <span className="border-primary-600/50 bg-primary-700/30 text-primary-300 group-hover:border-primary-500/50 group-hover:bg-primary-700/50 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors">
                    {item.category}
                  </span>
                </td>

                {/* Puan Alanı */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Star className="fill-secondary-2 text-secondary-2 h-4 w-4" />
                    <span className="text-primary-50 text-lg font-bold">
                      {item.averageScore}
                    </span>
                    <span className="text-primary-500 text-xs">/ 10</span>
                  </div>
                </td>

                {/* Oy Sayısı */}
                <td className="text-primary-400 px-6 py-4 text-right font-mono">
                  {item.totalVotes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Eğer veri yoksa */}
      {data.length === 0 && (
        <div className="text-primary-500 flex flex-col items-center justify-center py-12">
          <Trophy className="mb-3 h-10 w-10 opacity-20" />
          <p>Henüz puanlanmış içerik bulunmuyor.</p>
        </div>
      )}
    </div>
  );
}
