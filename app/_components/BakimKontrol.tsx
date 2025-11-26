import { ReactNode } from "react";
import supabaseServerClient from "../_lib/supabase/server";
import BakimSayfasi from "../_components/BakimSayfasi"; // Birazdan oluşturacağımız tasarım

const BakimKontrol = async ({ children }: { children: ReactNode }) => {
  const supabase = await supabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // KONTROL NOKTASI: Kullanıcı Admin mi?
  // Not: Supabase'de rolü 'app_metadata' içinde tuttuğunuzu varsayıyorum.
  const isAdmin = user?.app_metadata?.role === "admin";

  if (isAdmin) {
    // Admin ise siteyi olduğu gibi göster (VIP Girişi)
    return <>{children}</>;
  }

  // Admin değilse, şık bir bakım sayfası göster
  return <BakimSayfasi />;
};

export default BakimKontrol;
