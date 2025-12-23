/**
 * Bu layout, tüm PROFIL sayfalarını (`/profil`, `/profil/favoriler` vb.) kapsar.
 * Solda `ProfileSidebar` (navigasyon menüsü) ve sağda sayfa içeriğini (`children`) gösteren
 * iki sütunlu, responsive bir düzen (layout) oluşturur.
 */

import ProfileSidebar from "@/features/users/components/profile/ProfileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto">
      {/* 
        Responsive Düzen:
        - Mobil/Tablet: Stack (Alt alta)
        - Desktop (lg): Yan yana (Sidebar solda, İçerik sağda)
      */}
      <div className="flex min-h-screen w-full flex-col gap-x-10 gap-y-10 pt-40 lg:flex-row">
        {/* Sol Menü */}
        <ProfileSidebar />

        {/* Ana İçerik Alanı */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
