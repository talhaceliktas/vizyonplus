import { getCachedSettings } from "@settings/services/settingsService"; // Path'i kontrol et
import SettingsClient from "@/features/admin/components/settings/SettingsClient";

export const metadata = {
  title: "Sistem Ayarları | Admin",
};

export default async function AyarlarPage() {
  // 1. Veriyi sunucuda çekiyoruz
  const settingsData = await getCachedSettings();

  // 2. Client bileşenine gönderiyoruz
  return <SettingsClient initialData={settingsData} />;
}
