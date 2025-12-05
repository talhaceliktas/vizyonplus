import { getFeaturedContent } from "@/features/content/services/contentService";
import HeroSection from "../../features/content/components/home/HeroSection";
import ContentRow from "../../features/content/components/home/ContentRow";
import ScrollIndicator from "@/shared/components/ui/ScrollIndicator";

export const revalidate = 3600;

export default async function Page() {
  const featuredContent = await getFeaturedContent();

  return (
    <div>
      <div className="relative">
        <HeroSection data={featuredContent} />

        <div className="absolute bottom-10 left-1/2 z-50 -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </div>

      <div className="space-y-4 pb-10">
        <ContentRow type="film" category="Suç" title="Suç Filmleri" />
        <ContentRow type="dizi" category="Drama" title="Drama Dizileri" />
        <ContentRow type="film" category="Aksiyon" title="Aksiyon Filmleri" />
        <ContentRow type="dizi" category="Aksiyon" title="Aksiyon Dizileri" />
      </div>
    </div>
  );
}
