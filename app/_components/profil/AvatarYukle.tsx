"use client";

import React, { useState } from "react";
import supabase from "../../_lib/supabase/client";
import { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import NextImage from "next/image";
import { FaCamera } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface AvatarYukleProps {
  user: User;
  displayName: string | null;
  src: string | null;
}

export default function AvatarYukle({
  user,
  displayName,
  src,
}: AvatarYukleProps) {
  const [uploading, setUploading] = useState(false);

  // Görseli kare (1:1) formatında kırpma ve yeniden boyutlandırma
  async function resizeAndCropImage(file: File, size = 512): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        canvas.width = size;
        canvas.height = size;

        ctx?.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Görsel işlenemedi."));
          },
          "image/jpeg",
          0.85,
        );
      };

      reader.readAsDataURL(file);
    });
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Dosya 2 MB’tan büyük olamaz!");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Yalnızca JPG, PNG veya WEBP formatı kabul edilir.");
        return;
      }

      const processedImage = await resizeAndCropImage(file, 512);

      const filePath = `${user.id}/avatar.jpg`;

      const bucket = supabase.storage.from("profil_fotograflari");

      const { error: uploadError } = await bucket.upload(
        filePath,
        processedImage,
        {
          contentType: "image/jpeg",
          upsert: true,
        },
      );

      if (uploadError) throw uploadError;

      const { data } = bucket.getPublicUrl(filePath);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiller")
        .update({ profil_fotografi: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast.success("Profil fotoğrafı güncellendi ✨");
    } catch (error) {
      console.error(error);
      toast.error("Yükleme sırasında bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="group relative h-full w-full">
      {/* Profil Resmi */}
      <NextImage
        alt={`${displayName || "Kullanıcı"} fotoğrafı`}
        src={src || "/default-user.jpg"}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 144px, 208px"
        priority
      />

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
