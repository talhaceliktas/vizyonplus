"use client";

/**
 * Bu bileşen, kullanıcıların profil fotoğrafını yüklemesini ve güncellemesini sağlar.
 * - Tarayıcı tarafında resmi yeniden boyutlandırır ve kırpar (Canvas API).
 * - Resmi Supabase Storage'a yükler.
 * - Profil tablosundaki fotoğraf URL'sini günceller.
 */

import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import NextImage from "next/image";
import { FaCamera } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import supabase from "@/lib/supabase/client"; // Client-side işlemler için Supabase istemcisi
import { useRouter } from "next/navigation";

interface AvatarUploadProps {
  user: User;
  displayName: string | null;
  currentSrc: string | null; // Mevcut profil resmi URL'si
}

export default function AvatarUpload({
  user,
  displayName,
  currentSrc,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  /**
   * Yüklenen görseli kare (1:1) formatında kırpar ve belirtilen boyuta (örn: 512x512) küçültür.
   * Bu işlem tarayıcıda (client-side) yapılır, sunucuya yük binerilmez.
   */
  async function resizeAndCropImage(file: File, size = 512): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      // Dosyayı oku
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      // Resim yüklendiğinde canvas'a çiz
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // En kısa kenarı bul (Kare kırpma için)
        const minSide = Math.min(img.width, img.height);

        // Merkezi hizalayarak kırpma koordinatlarını hesapla
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        canvas.width = size;
        canvas.height = size;

        // Resmi canvas'a yeniden boyutlandırarak çiz
        ctx?.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        // Canvas içeriğini Blob (dosya verisi) olarak al
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Görsel işlenemedi."));
          },
          "image/jpeg",
          0.85, // Kalite oranı
        );
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Dosya seçildiğinde çalışan ana yükleme fonksiyonu.
   */
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      // 1. Boyut Kontrolü (Client-side)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Dosya 2 MB’tan büyük olamaz!");
        return;
      }

      // 2. Tip Kontrolü
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Yalnızca JPG, PNG veya WEBP formatı kabul edilir.");
        return;
      }

      // 3. Resmi İşle (Resize & Crop)
      const processedImage = await resizeAndCropImage(file, 512);

      // 4. Dosya Yolu Belirle
      // Cache'i aşmak için timestamp ekliyoruz, böylece resim anında güncel görünür.
      const fileName = `avatar-${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      const bucket = supabase.storage.from("profil_fotograflari");

      // Not: Eski resmi silmek iyi bir pratik olabilir, depolama alanını korur.

      // 5. Supabase Storage'a Yükle
      const { error: uploadError } = await bucket.upload(
        filePath,
        processedImage,
        {
          contentType: "image/jpeg",
          upsert: true, // Varsa üzerine yaz (Gerçi dosya adı benzersiz olduğu için her seferinde yeni oluşur)
        },
      );

      if (uploadError) throw uploadError;

      // 6. Public URL Al
      const { data } = bucket.getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // 7. Profil Tablosunu Güncelle (Veritabanı)
      const { error: updateError } = await supabase
        .from("profiller")
        .update({ profil_fotografi: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast.success("Profil fotoğrafı güncellendi ✨");

      // Sayfayı yenile
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Yükleme sırasında bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="group relative h-full w-full">
      {/* Mevcut Profil Resmi */}
      <NextImage
        alt={`${displayName || "Kullanıcı"} fotoğrafı`}
        src={currentSrc || "/default-user.jpg"}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 144px, 208px"
        priority
      />

      {/* Hover Overlay ve Yükleme Göstergesi */}
      <label
        htmlFor="avatar-upload"
        className={`absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-2 bg-black/50 text-white backdrop-blur-[2px] transition-all duration-300 ${
          uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <AiOutlineLoading3Quarters className="animate-spin text-3xl text-yellow-500" />
            <span className="text-xs font-bold text-yellow-500">
              Yükleniyor...
            </span>
          </div>
        ) : (
          <>
            <FaCamera className="text-3xl text-white drop-shadow-md" />
            <span className="text-xs font-medium text-gray-200">Değiştir</span>
          </>
        )}
      </label>

      {/* Gizli Dosya Inputu */}
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
}
