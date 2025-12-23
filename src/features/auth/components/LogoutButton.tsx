/**
 * Bu bileşen, kullanıcının oturumu kapatmasını sağlar.
 * Supabase `signOut` fonksiyonunu çağırır ve ardından kullanıcıyı belirtilen sayfaya (varsayılan: `/giris`) yönlendirir.
 */

"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import toast from "react-hot-toast";
import supabaseBrowserClient from "@lib/supabase/client";

interface LogoutButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  href?: string;
}

const LogoutButton = ({
  children,
  icon,
  className,
  href = "/giris",
}: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Supabase oturumunu sonlandır (Browser tarafında)
      await supabaseBrowserClient.auth.signOut();

      toast.success("Başarıyla çıkış yapıldı");

      // Sayfayı yenile (Server Component'lerin user durumunu güncellemesi için)
      router.refresh();

      // Yönlendir
      router.push(href);
    } catch (error) {
      console.error("Çıkış hatası:", error);
      toast.error("Çıkış yapılırken bir hata oluştu");
    }
  };

  return (
    <button onClick={handleLogout} className={className} type="button">
      <span>{children}</span>
      <span className="">{icon}</span>
    </button>
  );
};

export default LogoutButton;
