import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaClock } from "react-icons/fa6"; // Lucide yerine React Icons (Tutarlılık için)
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface WatchHistoryCardProps {
  item: {
    historyId: number;
    updatedAt: string;
    watchedSeconds: number;
    totalSeconds: number;
    percentage: number;
    content: {
      id: number;
      isim: string;
      fotograf: string;
    };
    detail: string;
    type: string;
  };
}

const WatchHistoryCard = ({ item }: WatchHistoryCardProps) => {
  const { content, percentage, detail, type, updatedAt } = item;

  const href =
    type === "film" ? `/izle/film/${content.id}` : `/izle/dizi/${content.id}`;

  return (
    <div className="group border-primary-800 bg-primary-900 hover:border-secondary-1/50 hover:bg-primary-800/50 relative flex gap-4 overflow-hidden rounded-xl border p-3 transition-all hover:shadow-lg">
      {/* Resim Alanı */}
      <div className="relative aspect-2/3 w-24 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={content.fotograf}
          alt={content.isim}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="bg-secondary-1 text-primary-950 flex h-8 w-8 items-center justify-center rounded-full shadow-lg">
            <FaPlay className="pl-0.5 text-sm" />
          </div>
        </div>
      </div>

      {/* Bilgi Alanı */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-primary-50 group-hover:text-secondary-1 line-clamp-1 text-lg font-bold transition-colors">
              {content.isim}
            </h3>
            <span className="bg-primary-800 text-primary-400 shrink-0 rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              {type === "film" ? "FİLM" : "DİZİ"}
            </span>
          </div>

          {/* Dizi ise Sezon/Bölüm Bilgisi */}
          {detail && (
            <p className="text-secondary-1 mt-0.5 text-sm font-medium">
              {detail}
            </p>
          )}

          <div className="text-primary-500 mt-2 flex items-center gap-2 text-xs">
            <FaClock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(updatedAt), {
                addSuffix: true,
                locale: tr,
              })}{" "}
              izlendi
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-primary-400">Kalan Süre</span>
            <span className="text-secondary-1 font-bold">
              %{Math.round(percentage)}
            </span>
          </div>

          <div className="bg-primary-800 relative h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-secondary-1 absolute top-0 left-0 h-full rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <Link href={href} className="absolute inset-0 z-10" />
        </div>
      </div>
    </div>
  );
};

export default WatchHistoryCard;
