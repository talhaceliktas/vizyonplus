"use client";

import { useState } from "react";
import Image from "next/image";

// 1. Kullanıcı objesinin tipi (Veritabanından gelen yapı)
interface User {
  id: string;
  isim: string | null;
  yasakli_mi: boolean;
  profil_fotografi?: string | null;
  olusturulma_zamani: string;
}

// 2. Component'e gelen Props'ların tipi
interface UserCardProps {
  kullanici: User;
  // Fonksiyonların ne parametre aldığı ve ne döndürdüğü
  onBanToggle: (id: string, suankiDurum: boolean) => void | Promise<void>;
  onNameUpdate: (id: string, yeniIsim: string) => void | Promise<void>;
}

export default function UserCard({
  kullanici,
  onBanToggle,
  onNameUpdate,
}: UserCardProps) {
  // <--- Props tipini buraya ekledik
  const [isEditing, setIsEditing] = useState(false);
  const [yeniIsim, setYeniIsim] = useState(kullanici.isim || "");

  const handleKaydetClick = () => {
    onNameUpdate(kullanici.id, yeniIsim);
    setIsEditing(false);
  };

  const handleIptalClick = () => {
    setYeniIsim(kullanici.isim || ""); // Eski isme dön
    setIsEditing(false);
  };

  return (
    <div
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
          {isEditing ? (
            <div className="flex gap-2">
              <input
                value={yeniIsim}
                onChange={(e) => setYeniIsim(e.target.value)}
                className="rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleKaydetClick}
                className="text-sm text-green-400 hover:underline"
              >
                Kaydet
              </button>
              <button
                onClick={handleIptalClick}
                className="text-sm text-gray-400 hover:underline"
              >
                İptal
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={`font-bold ${
                  kullanici.yasakli_mi
                    ? "text-red-400 line-through"
                    : "text-secondary-1"
                }`}
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
            {new Date(kullanici.olusturulma_zamani).toLocaleDateString("tr-TR")}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
          >
            Düzenle
          </button>
        )}

        <button
          onClick={() => onBanToggle(kullanici.id, kullanici.yasakli_mi)}
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
  );
}
