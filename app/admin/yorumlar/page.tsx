"use client";

import { useEffect, useState } from "react";
import {
  yorumlariCekAdmin,
  yorumuSilAdmin,
} from "../../_lib/data-service-client";

export default function Page() {
  const [yorumlar, setYorumlar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const yorumlariAyarla = async () => {
      setLoading(true);
      const { data, durum } = await yorumlariCekAdmin();

      if (durum === "basarisiz")
        alert("Yorumlar getirilirken bir sorun oluştu!");
      else setYorumlar(data);

      setLoading(false);
    };

    yorumlariAyarla();
  }, []);

  async function yorumuSilTiklandi(yorumId: number) {
    const { durum } = await yorumuSilAdmin(yorumId);

    if (durum === "basarili")
      setYorumlar((yorumlar) =>
        yorumlar.filter((yorum) => yorum.id !== yorumId),
      );
  }

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Son Yapılan Yorumlar</h1>

      <div className="space-y-4">
        {yorumlar.map((yorum) => (
          <div
            key={yorum.id}
            className="flex items-start justify-between rounded border bg-gray-800 p-4"
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

        {yorumlar.length === 0 && <p>Henüz hiç yorum yok.</p>}
      </div>
    </div>
  );
}
