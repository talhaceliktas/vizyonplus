"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaTrash, FaExternalLinkAlt } from "react-icons/fa";

// UI Bileşenleri
import SectionBox from "@/features/admin/components/ui/SectionBox";
import { deleteCommentAction } from "@/features/admin/actions/comments-actions";

// Tip Tanımlaması (View yapına göre düzenle)
interface Comment {
  id: number;
  yorum: string;
  spoiler_mi: boolean;
  olusturulma_zamani: string;
  kullanici_adi: string;
  icerik_adi: string;
}

interface CommentsClientProps {
  initialComments: Comment[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export default function CommentsClient({
  initialComments,
  totalCount,
  currentPage,
  pageSize,
}: CommentsClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const maxPage = Math.ceil(totalCount / pageSize);

  // Silme İşlemi
  const handleDelete = async (id: number) => {
    if (!confirm("Bu yorumu kalıcı olarak silmek istediğinize emin misiniz?"))
      return;

    setIsDeleting(true);
    const result = await deleteCommentAction(id);
    setIsDeleting(false);

    if (result.success) {
      toast.success("Yorum silindi.");
      // Action içinde revalidatePath var ama client tarafında da router.refresh()
      // yaparak anlık güncellemeyi garantiye alalım.
      router.refresh();
    } else {
      toast.error("Hata: " + result.error);
    }
  };

  // Sayfa Değiştirme
  const changePage = (newPage: number) => {
    // URL'i güncelle -> Server Component bunu yakalayıp yeni veri çekecek
    router.push(`/admin/yorumlar?page=${newPage}`);
  };

  return (
    <SectionBox title={`Yorum Yönetimi (Toplam: ${totalCount})`}>
      {/* --- TABLO --- */}
      <div className="overflow-hidden rounded-lg border border-neutral-800">
        <table className="w-full text-left text-sm text-neutral-400">
          <thead className="bg-neutral-800 text-xs text-neutral-300 uppercase">
            <tr>
              <th className="px-6 py-3">Kullanıcı</th>
              <th className="px-6 py-3">İçerik</th>
              <th className="px-6 py-3">Yorum</th>
              <th className="px-6 py-3 text-center">Tarih</th>
              <th className="px-6 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {initialComments.map((comment) => (
              <tr
                key={comment.id}
                className="group transition-colors hover:bg-neutral-800/30"
              >
                {/* Kullanıcı */}
                <td className="px-6 py-4 font-medium text-white">
                  {comment.kullanici_adi}
                </td>

                {/* İçerik */}
                <td className="text-primary-400 px-6 py-4">
                  <div className="flex items-center gap-1">
                    {comment.icerik_adi}
                    <FaExternalLinkAlt className="text-[10px] opacity-0 group-hover:opacity-50" />
                  </div>
                </td>

                {/* Yorum Metni */}
                <td className="max-w-xs px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <p className="line-clamp-2 text-neutral-300">
                      {comment.yorum}
                    </p>
                    {comment.spoiler_mi && (
                      <span className="inline-block w-fit rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-500">
                        SPOILER
                      </span>
                    )}
                  </div>
                </td>

                {/* Tarih */}
                <td className="px-6 py-4 text-center text-xs">
                  {new Date(comment.olusturulma_zamani).toLocaleDateString(
                    "tr-TR",
                  )}
                </td>

                {/* Aksiyon */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={isDeleting}
                    className="text-neutral-500 transition-colors hover:text-red-500 disabled:opacity-50"
                    title="Yorumu Sil"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {initialComments.length === 0 && (
          <div className="p-8 text-center text-neutral-500">
            Henüz hiç yorum yapılmamış.
          </div>
        )}
      </div>

      {/* --- SAYFALAMA (PAGINATION) --- */}
      {totalCount > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Önceki
          </button>

          <span className="text-sm text-neutral-400">
            Sayfa <span className="font-bold text-white">{currentPage}</span> /{" "}
            {maxPage}
          </span>

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= maxPage}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      )}
    </SectionBox>
  );
}
