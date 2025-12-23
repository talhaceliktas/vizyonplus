"use client";

// 1. Suspense eklendi
import { useEffect, useState, Suspense } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  kullanicilariCekAdmin,
  kullaniciIsimGuncelle,
  kullaniciBanDurumuDegistir,
} from "@admin/actions/user-actions";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";
import UserCard from "../../../features/admin/components/users/UserCard";
import Pagination from "../../../features/content/components/list/Pagination";

interface User {
  id: string;
  isim: string | null;
  yasakli_mi: boolean;
  profil_fotografi?: string | null;
  olusturulma_zamani: string;
}

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_CONTENT_PAGE_SIZE!) || 10;

// --- 2. ASIL MANTIK BİLEŞENİ (İsmi değişti ve export default kaldırıldı) ---
function KullanicilarContent() {
  const [kullanicilar, setKullanicilar] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // nuqs burada kullanılıyor, bu yüzden bu bileşen Suspense içinde olmalı
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  useEffect(() => {
    const veriGetir = async () => {
      setLoading(true);
      const currentPage = page || 1;

      const { data, count, durum } = await kullanicilariCekAdmin(
        currentPage,
        PAGE_SIZE,
      );

      if (durum === "basarisiz") {
        alert("Kullanıcılar alınamadı!");
      } else {
        setKullanicilar(data as User[]);
        // DÜZELTME: API'den gelen toplam sayıyı state'e işlemeyi unutmuşsunuz, ekledim.
        if (count) setTotalCount(count); 
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

  const handleNameUpdate = async (id: string, yeniIsim: string) => {
    const { durum } = await kullaniciIsimGuncelle(id, yeniIsim);

    if (durum === "basarili") {
      setKullanicilar((users) =>
        users.map((u) => (u.id === id ? { ...u, isim: yeniIsim } : u)),
      );
    } else {
      alert("İsim güncellenemedi.");
    }
  };

  // Content içinde de loading gösterebiliriz ama ana loading Suspense ile gelecek
  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <span className="text-sm text-gray-400">Toplam Üye: {totalCount}</span>
      </div>

      <div className="space-y-4">
        {kullanicilar.map((kullanici) => (
          <UserCard
            key={kullanici.id}
            kullanici={kullanici}
            onBanToggle={handleBanToggle}
            onNameUpdate={handleNameUpdate}
          />
        ))}
      </div>

      <Pagination totalCount={totalCount} />
    </div>
  );
}

// --- 3. SARMALAYICI (WRAPPER) BİLEŞEN ---
// Next.js'in gördüğü ve çalıştırdığı ana bileşen budur.
export default function KullanicilarPage() {
  return (
    // URL parametreleri okunurken sayfa patlamasın diye Suspense ile sarmaladık
    <Suspense fallback={<LoadingSpinner />}>
      <KullanicilarContent />
    </Suspense>
  );
}