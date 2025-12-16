import Image from "next/image";
import { Heart, Bookmark, ThumbsUp } from "lucide-react";
import { InteractionItem } from "../../services/statsService";

interface InteractionTableProps {
  title: string;
  data: InteractionItem[];
  type: "favorite" | "watch_later" | "like";
}

export default function InteractionTable({
  title,
  data,
  type,
}: InteractionTableProps) {
  const getIcon = () => {
    switch (type) {
      case "favorite":
        return <Heart className="h-4 w-4 fill-red-500/20 text-red-500" />;
      case "watch_later":
        return <Bookmark className="h-4 w-4 fill-blue-500/20 text-blue-500" />;
      case "like":
        return (
          <ThumbsUp className="h-4 w-4 fill-green-500/20 text-green-500" />
        );
    }
  };

  return (
    <div className="border-primary-700 bg-primary-800/40 flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm backdrop-blur-sm">
      <div className="border-primary-700/50 border-b p-6">
        <h3 className="text-primary-50 text-lg font-semibold">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="text-primary-300 w-full text-left text-sm">
          <thead className="bg-primary-900/20 text-primary-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">İçerik</th>
              <th className="px-6 py-4 text-right font-semibold tracking-wider">
                Toplam
              </th>
            </tr>
          </thead>
          <tbody className="divide-primary-700/50 divide-y">
            {data.map((item) => (
              <tr
                key={item.contentId}
                className="group hover:bg-primary-700/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-700 ring-primary-600/50 relative h-12 w-20 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="80px"
                        />
                      ) : (
                        <div className="text-primary-500 flex h-full w-full items-center justify-center text-xs">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-primary-100 line-clamp-1 block font-medium transition-colors group-hover:text-white">
                        {item.title}
                      </span>
                      <span className="bg-primary-700/50 text-primary-400 inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[10px] font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-primary-50 font-mono text-lg font-bold">
                      {item.count}
                    </span>
                    {getIcon()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-primary-500 flex flex-col items-center justify-center py-12">
          <p>Veri yok.</p>
        </div>
      )}
    </div>
  );
}
