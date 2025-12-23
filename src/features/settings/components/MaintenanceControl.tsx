/**
 * Bu bileşen, uygulamanın bakım modunda olup olmadığını kontrol eder.
 * Ancak, yöneticilerin (admin) sisteme erişmesine izin verir.
 * Normal kullanıcılar için `MaintenancePage` (Bakım Sayfası) gösterilir.
 */

import { ReactNode } from "react";
import supabaseServer from "@lib/supabase/server";
import MaintenancePage from "./MaintenancePage";

export default async function MaintenanceControl({
  children,
}: {
  children: ReactNode;
}) {
  // Sunucu tarafında oturum kontrolü
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Kullanıcının rolünü kontrol et
  const isAdmin = user?.app_metadata?.role === "admin";

  // Eğer kullanıcı admin ise, içeriği (children) render et
  if (isAdmin) {
    return children;
  }

  // Değilse ve bakım modu aktifse (Bu kontrolü çağıran üst bileşen yapmış olmalı)
  // veya bu bileşen direkt bakım durumunda kullanılıyorsa:
  return <MaintenancePage />;
}
