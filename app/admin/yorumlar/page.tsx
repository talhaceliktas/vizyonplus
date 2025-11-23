"use client";

import { useEffect, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  yorumlariCekAdmin,
  yorumuSilAdmin,
} from "../../_lib/data-service-client";
import Yukleniyor from "../../_components/ui/Yukleniyor";

const PAGE_SIZE = 10;

export default function Page() {
  const [yorumlar, setYorumlar] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  useEffect(() => {
    const yorumlariAyarla = async () => {
      setLoading(true);
      const { data, count, durum } = await yorumlariCekAdmin(page, PAGE_SIZE);

      if (durum === "basarisiz") {
        alert("Yorumlar getirilirken bir sorun oluştu!");
      } else {
        setYorumlar(data);
        setTotalCount(count || 0);
      }

      setLoading(false);
    };

    yorumlariAyarla();
  }, [page]);

  async function yorumuSilTiklandi(yorumId: number) {
    if (!confirm("Bu yorumu silmek istediğine emin misin?")) return;

    const { durum } = await yorumuSilAdmin(yorumId);

    if (durum === "basarili") {
      setYorumlar((prev) => {
        const yeniListe = prev.filter((yorum) => yorum.id !== yorumId);

        if (yeniListe.length === 0 && page > 1) {
          setPage((e) => e - 1);
        }

        return yeniListe;
      });

      setTotalCount((prev) => prev - 1);
    } else {
      alert("Silme işlemi başarısız oldu.");
    }
  }

  if (loading)
    return (
      <div className="p-4 text-gray-400">
        <Yukleniyor />
      </div>
    );

  const maxPage = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Son Yapılan Yorumlar</h1>
        <span className="text-sm text-gray-400">Toplam: {totalCount}</span>
      </div>

      <div className="space-y-4">
        {yorumlar.map((yorum) => (
          <div
            key={yorum.id}
            className="flex items-start justify-between rounded border border-gray-700 bg-gray-800 p-4"
          >
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="font-bold text-green-400">
                  {yorum.kullanici_adi}
                </span>
                <span className="text-sm text-gray-400">
                  → {yorum.icerik_adi}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(yorum.olusturulma_zamani).toLocaleDateString(
                    "tr-TR",
                  )}
                </span>
              </div>

              <p className="text-gray-200">{yorum.yorum}</p>

              {yorum.spoiler_mi && (
                <span className="mt-2 inline-block rounded bg-red-900 px-2 py-0.5 text-xs text-red-200">
                  SPOILER
                </span>
              )}
            </div>

            <button
              onClick={() => yorumuSilTiklandi(yorum.id)}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
            >
              Kaldır
            </button>
          </div>
        ))}

        {yorumlar.length === 0 && (
          <p className="text-gray-400">Henüz hiç yorum yok.</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-600 disabled:opacity-50"
        >
          Geri
        </button>
        <span className="text-gray-300">
          Sayfa {page} / {maxPage || 1}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= maxPage}
          className="rounded bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-600 disabled:opacity-50"
        >
          İleri
        </button>
      </div>
    </div>
  );
}
