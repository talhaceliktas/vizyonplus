"use client";
import React, { useState } from "react";
import supabase from "../../_lib/supabase/client";
import { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

import NextImage from "next/image";
import { FaPencilAlt } from "react-icons/fa";

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
        toast.error(
          "Yalnızca JPG, PNG veya WEBP formatında görsel yükleyebilirsin!",
        );
        return;
      }

      const processedImage = await resizeAndCropImage(file, 512);
      const filePath = `${user.id}/avatar.jpg`;
      const bucket = supabase.storage.from("profil_fotograflari");

      await bucket.remove([filePath]);

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

      toast.success("Profil fotoğrafı güncellendi ✅");
    } catch {
      toast.error("Yükleme hatası");
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="border-primary-600 group relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 md:h-52 md:w-52">
        <NextImage
          alt={`${displayName || "Kullanıcı"} fotoğrafı`}
          src={src || "/default-user.jpg"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 144px, 208px"
        />

        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-2 bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <FaPencilAlt className="text-2xl md:text-3xl" />
          <span className="text-xs font-medium md:text-sm">
            Avatarı Değiştir
          </span>
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

      {uploading && (
        <p className="animate-pulse text-sm text-gray-500">Yükleniyor...</p>
      )}
    </div>
  );
}
