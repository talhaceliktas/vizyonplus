import Link from "next/link";
import { getContents } from "../../services/contentService";
import ContentSlider from "./ContentSlider";

interface ContentRowProps {
  type: string; // "film" veya "dizi"
  category: string; // "Aksiyon", "Dram" vb.
  title?: string; // İsteğe bağlı özel başlık
}

// BU DOSYA NE İŞE YARAR?
// Ana sayfadaki yatay içerik listeleridir (Örn: "Aksiyon Filmleri").
// Bu bir Server Component'tir. Veriyi sunucuda çeker ve Client Component olan "ContentSlider"a gönderir.

const ContentRow = async ({ type, category, title }: ContentRowProps) => {
  // VERİ ÇEKME (Server Side)
  // "await" ile veritabanından ilgili kategoriye ait içerikleri bekle.
  const contents = await getContents(type, category);

  // Eğer içerik yoksa bu satırı hiç çizme (Boşluk olmasın).
  if (!contents || contents.length === 0) return null;

  // "Tümünü Gör" linkinin gideceği adres
  const listUrl = `/icerikler/?tur=${type}&kategori=${category}`;

  // Başlık belirlenmemişse otomatik oluştur: "Aksiyon Filmleri"
  const displayTitle =
    title || `${category} ${type === "film" ? "Filmleri" : "Dizileri"}`;

  return (
    <div className="py-4 pr-4 pl-4 md:py-8 md:pl-12">
      {/* Başlık ve Link Alanı */}
      <div className="mb-4 flex items-end justify-between px-2">
        <h2 className="text-secondary-1-2 text-lg font-semibold md:text-2xl lg:text-3xl">
          {displayTitle}
        </h2>

        <Link
          href={listUrl}
          className="text-primary-50 hover:text-primary-400 text-sm font-medium duration-200 hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>

      {/* İÇERİK SLIDER */}
      {/* Veriyi (contents) prop olarak Client Component'e gönderiyoruz. */}
      {/* Çünkü slider kaydırma işlemleri tarayıcıda (Client Side) olur. */}
      <ContentSlider items={contents} />
    </div>
  );
};

export default ContentRow;
