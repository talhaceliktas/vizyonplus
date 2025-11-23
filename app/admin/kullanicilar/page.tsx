"use client";

import { useEffect, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  kullanicilariCekAdmin,
  kullaniciIsimGuncelle,
  kullaniciBanDurumuDegistir,
} from "../../../app/_lib/data-service-client";
import Image from "next/image";

const PAGE_SIZE = 10;

export default function KullanicilarPage() {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [yeniIsim, setYeniIsim] = useState("");

  useEffect(() => {
    const veriGetir = async () => {
      setLoading(true);
      const { data, count, durum } = await kullanicilariCekAdmin(
        page,
        PAGE_SIZE,
      );
      if (durum === "basarisiz") alert("Kullanıcılar alınamadı!");
      else {
        setKullanicilar(data);
        setTotalCount(count || 0);
      }
      setLoading(false);
    };
    veriGetir();
  }, [page]);

  const handleBanToggle = async (id: string, suankiDurum: boolean) => {
    const onayMesaji = suankiDurum
      ? "Bu kullanıcının yasağını kaldırmak istiyor musun?"
      : "Bu kullanıcıyı banlamak istiyor musun?";

    if (!confirm(onayMesaji)) return;

    const { durum } = await kullaniciBanDurumuDegistir(id, suankiDurum);
    if (durum === "basarili") {
      setKullanicilar((users) =>
        users.map((u) =>
          u.id === id ? { ...u, yasakli_mi: !suankiDurum } : u,
        ),
      );
    }
  };

  const handleDuzenleClick = (kullanici) => {
    setDuzenlenenId(kullanici.id);
    setYeniIsim(kullanici.isim || "");
  };

  const handleKaydet = async (id: string) => {
    const { durum } = await kullaniciIsimGuncelle(id, yeniIsim);
    if (durum === "basarili") {
      setKullanicilar((users) =>
        users.map((u) => (u.id === id ? { ...u, isim: yeniIsim } : u)),
      );
      setDuzenlenenId(null);
    } else {
      alert("İsim güncellenemedi.");
    }
  };

  if (loading) return <div className="p-4 text-gray-400">Yükleniyor...</div>;

  const maxPage = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <span className="text-sm text-gray-400">Toplam Üye: {totalCount}</span>
      </div>

      <div className="space-y-4">
        {kullanicilar.map((kullanici) => (
          <div
            key={kullanici.id}
            className={`flex items-center justify-between rounded border p-4 transition ${
              kullanici.yasakli_mi
                ? "border-red-900 bg-red-900/10"
                : "border-gray-700 bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-4">
              <Image
                src={kullanici.profil_fotografi || "/default-user.jpg"}
                alt="Avatar"
                className="rounded-full border border-gray-600 object-cover"
                width={50}
                height={50}
              />

              <div>
                {duzenlenenId === kullanici.id ? (
                  <div className="flex gap-2">
                    <input
                      value={yeniIsim}
                      onChange={(e) => setYeniIsim(e.target.value)}
                      className="rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
                    />
                    <button
                      onClick={() => handleKaydet(kullanici.id)}
                      className="text-sm text-green-400 hover:underline"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setDuzenlenenId(null)}
                      className="text-sm text-gray-400 hover:underline"
                    >
                      İptal
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${kullanici.yasakli_mi ? "text-red-400 line-through" : "text-secondary-1"}`}
                    >
                      {kullanici.isim || "İsimsiz Kullanıcı"}
                    </span>
                    {kullanici.yasakli_mi && (
                      <span className="text-xs font-bold text-red-500">
                        (YASAKLI)
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-1 text-xs text-gray-500">
                  ID: {kullanici.id} • Kayıt:{" "}
                  {new Date(kullanici.olusturulma_zamani).toLocaleDateString(
                    "tr-TR",
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {duzenlenenId !== kullanici.id && (
                <button
                  onClick={() => handleDuzenleClick(kullanici)}
                  className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
                >
                  Düzenle
                </button>
              )}

              <button
                onClick={() =>
                  handleBanToggle(kullanici.id, kullanici.yasakli_mi)
                }
                className={`rounded px-3 py-1.5 text-sm text-white transition ${
                  kullanici.yasakli_mi
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {kullanici.yasakli_mi ? "Yasağı Kaldır" : "Banla"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sayfalama Butonları (Aynı yapı) */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
        >
          Geri
        </button>
        <span className="text-gray-300">
          Sayfa {page} / {maxPage || 1}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= maxPage}
          className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
        >
          İleri
        </button>
      </div>
    </div>
  );
}
