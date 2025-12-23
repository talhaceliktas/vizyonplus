import { getCachedSettings } from "@settings/services/settingsService";
import RegisterPageWrapper from "@/features/auth/components/RegisterPageWrapper";
import RegistrationClosed from "@/features/auth/components/RegistrationClosed"; // Bunu bir önceki adımda oluşturmuştuk

// BU DOSYA NE İŞE YARAR?
// Kullanıcının kayıt olduğu sayfadır.
// Bu bir "Server Component"tir (varsayılan Next.js davranışı).
// Veritabanından ayarları çekip, kayıtların açık olup olmadığını kontrol eder.

// SEO AYARLARI
export const metadata = {
  title: "Kayıt Ol | Vizyon+",
  description: "Aramıza katılın ve sınırsız içeriğin tadını çıkarın.",
};

// SERVER COMPONENT VE ASYNC FONKSİYON
// "async" anahtar kelimesi, bu bileşenin sunucuda (server) çalışacağını ve
// veri tabanı gibi kaynaklardan veri çekebileceğini belirtir.
export default async function KayitOlPage() {
  // ADIM 1: SİSTEM AYARLARINI GETİR
  // Veritabanından (veya cache'den) ayarları çeker.
  // Bu işlem sunucu tarafında gerçekleşir, istemciye (tarayıcıya) sadece sonuç HTML gider.
  const settings = await getCachedSettings();

  // ADIM 2: KAYIT DURUMUNU KONTROL ET
  // Eğer ayar bulunamazsa varsayılan olarak "true" (açık) kabul eder.
  // "??" operatörü (Nullish Coalescing): Sol taraf null/undefined ise sağ tarafı kullanır.
  const kayitlarAcik = settings?.yeni_uye_alimi ?? true;

  // ADIM 3: DURUMA GÖRE BİLEŞEN GÖSTER (CONDITIONAL RENDERING)
  // Eğer kayıtlar açıksa kayıt formunu, kapalıysa bilgilendirme ekranını gösterir.
  return kayitlarAcik ? <RegisterPageWrapper /> : <RegistrationClosed />;
}
