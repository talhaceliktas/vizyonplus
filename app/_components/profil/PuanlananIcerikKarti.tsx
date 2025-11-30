"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Calendar, Clock } from "lucide-react";
import IcerikPuanla from "../icerikler/dizi-film/IcerikPuanla";
import { puaniKaldir } from "../../_lib/data-service-server";
import toast from "react-hot-toast";
import { useState } from "react";

export default function PuanlananIcerikKarti({ kayit }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const film = kayit.icerikler;

  const handleSil = async () => {
    if (
      !confirm(
        `"${film.isim}" için verdiğiniz puanı kaldırmak istiyor musunuz?`,
      )
    )
      return;

    setIsDeleting(true);
    const res = await puaniKaldir(kayit.id);

    if (res.error) {
      toast.error("Silinemedi: " + res.error);
      setIsDeleting(false);
    } else {
      toast.success("Puan kaldırıldı");
      // Server action revalidatePath yaptığı için router.refresh() otomatiktir,
      // ama anlık UI tepkisi için state yönetimi veya router.refresh kullanılabilir.
    }
  };

  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 md:flex-row">
      {/* --- SOL: GÖRSEL --- */}
      <Link
        href={
          film.tur === "dizi"
            ? `/izle/dizi/${film.id}`
            : `/izle/film/${film.id}`
        }
        className="relative aspect-[2/3] w-full shrink-0 md:w-32"
      >
        <Image
          src={film.fotograf}
          alt={film.isim}
          fill
          className="rounded-lg object-cover shadow-lg transition-transform group-hover:scale-105"
        />
      </Link>

      {/* --- ORTA: BİLGİLER --- */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-white">
              <Link
                href={
                  film.tur === "dizi"
                    ? `/izle/dizi/${film.id}`
                    : `/izle/film/${film.id}`
                }
                className="transition-colors hover:text-yellow-500"
              >
                {film.isim}
              </Link>
            </h3>
            {/* Silme Butonu (Masaüstü için sağ üstte) */}
            <button
              onClick={handleSil}
              disabled={isDeleting}
              className="hidden rounded-full p-2 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-500 md:block"
              title="Puanı Kaldır"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 uppercase">
              {film.tur}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />{" "}
              {new Date(film.yayinlanma_tarihi).getFullYear()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {film.sure} dk
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-gray-300">
            {film.aciklama}
          </p>
        </div>

        {/* --- ALT: PUANLAMA & MOBİL SİLME --- */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
          <div className="origin-left scale-90">
            {/* Mevcut Puanlama Bileşenini Yeniden Kullanıyoruz */}
            <IcerikPuanla icerikId={film.id} mevcutPuan={kayit.puan} />
          </div>

          {/* Mobil Silme Butonu */}
          <button
            onClick={handleSil}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 md:hidden"
          >
            <Trash2 className="h-4 w-4" /> Kaldır
          </button>
        </div>
      </div>
    </div>
  );
}
