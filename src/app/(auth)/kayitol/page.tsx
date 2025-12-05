import { getCachedSettings } from "@settings/services/settingsService";
import RegisterPageWrapper from "@/features/auth/components/RegisterPageWrapper";
import RegistrationClosed from "@/features/auth/components/RegistrationClosed"; // Bunu bir önceki adımda oluşturmuştuk

export const metadata = {
  title: "Kayıt Ol | Vizyon+",
  description: "Aramıza katılın ve sınırsız içeriğin tadını çıkarın.",
};

export default async function KayitOlPage() {
  const settings = await getCachedSettings();

  const kayitlarAcik = settings?.yeni_uye_alimi ?? true;

  return kayitlarAcik ? <RegisterPageWrapper /> : <RegistrationClosed />;
}
