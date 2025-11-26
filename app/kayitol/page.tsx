import KayitSayfasi from "../_components/giris-kayit/KayitSayfasi";
import KayitlarKapaliPage from "../_components/KayitlarKapaliPage";
import { getCachedSettings, SiteSettings } from "../_lib/supabase/get-settings";

const Page = async () => {
  const settings: SiteSettings = await getCachedSettings();

  return settings.yeni_uye_alimi ? <KayitSayfasi /> : <KayitlarKapaliPage />;
};

export default Page;
