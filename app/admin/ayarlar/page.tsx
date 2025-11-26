import { getCachedSettings } from "../../_lib/supabase/get-settings"; // Veri çekme fonksiyonun
import AyarlarClient from "../../_components/admin/layout/AyarlarClient"; // Az önce oluşturduğumuz client component

export default async function AyarlarPage() {
  // 1. Veriyi sunucuda (Server Side) çekiyoruz
  // Bu işlem çok hızlıdır ve SEO dostudur
  const settingsData = await getCachedSettings();

  // 2. Veriyi client bileşenine gönderiyoruz
  return <AyarlarClient initialData={settingsData} />;
}
