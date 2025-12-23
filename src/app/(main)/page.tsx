import { getFeaturedContent } from "@/features/content/services/contentService";
import HeroSection from "../../features/content/components/home/HeroSection";
import ContentRow from "../../features/content/components/home/ContentRow";
import ScrollIndicator from "@/shared/components/ui/ScrollIndicator";

// ISR (Incremental Static Regeneration)
// Bu sayfa sunucuda oluşturulur (Static Generation) ama 3600 saniyede (1 saat) bir
// arka planda yeniden oluşturulur. Böylece hem hızlıdır hem de veriler 1 saatte bir güncellenir.
export const revalidate = 3600;

// BU DOSYA NE İŞE YARAR?
// Ana Sayfa'dır (Home Page).
// Kullanıcı siteye girdiğinde ilk gördüğü ekrandır.
// Slider (Hero) ve içerik listelerini barındırır.

export default async function Page() {
  // ÖNE ÇIKAN İÇERİK
  // Ana sayfadaki büyük slider için gerekli veriyi çeker.
  const featuredContent = await getFeaturedContent();

  return (
    <div>
      {/* HERO SECTION (Slider Alanı) */}
      <div className="relative">
        <HeroSection data={featuredContent} />

        {/* Scroll Indicator: Aşağı kaydır oku */}
        {/* absolute bottom-10: Alt kısımdan 10 birim yukarı sabitle. */}
        {/* left-1/2 -translate-x-1/2: Tam yatay ortaya hizala. */}
        <div className="absolute bottom-10 left-1/2 z-50 -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </div>

      {/* İÇERİK LİSTELERİ (Rows) */}
      {/* space-y-4: Listeler arasında dikey boşluk bırak. */}
      <div className="space-y-4 pb-10">
        <ContentRow type="film" category="Suç" title="Suç Filmleri" />
        <ContentRow type="dizi" category="Drama" title="Drama Dizileri" />
        <ContentRow type="film" category="Aksiyon" title="Aksiyon Filmleri" />
        <ContentRow type="dizi" category="Aksiyon" title="Aksiyon Dizileri" />
      </div>
    </div>
  );
}
