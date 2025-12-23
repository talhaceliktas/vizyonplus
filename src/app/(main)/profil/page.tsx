/**
 * Bu sayfa, kullanıcının PROFIL AYARLARI'nı görüntülediği ana sayfadır (`/profil`).
 * İçerik Sunucu Bileşeni olan `ProfileSettings` üzerinden yüklenir.
 * Yükleme esnasında `ProfileSettingsSkeleton` gösterilir.
 */

import { Suspense } from "react";
import ProfileSettings from "@/features/users/components/profile/ProfileSettings";
import ProfileSettingsSkeleton from "../../../features/users/components/skeleton/ProfileSettingsSkeleton";

export const metadata = {
  title: "Profil Ayarları | Vizyon+",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSettingsSkeleton />}>
      <ProfileSettings />
    </Suspense>
  );
}
