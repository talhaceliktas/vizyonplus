import Link from "next/link";
import { getContents } from "../../services/contentService";
import ContentSlider from "./ContentSlider";

interface ContentRowProps {
  type: string;
  category: string;
  title?: string;
}

const ContentRow = async ({ type, category, title }: ContentRowProps) => {
  const contents = await getContents(type, category);

  if (!contents || contents.length === 0) return null;

  const listUrl = `/icerikler/${type === "film" ? "filmler" : "diziler"}?tur=${category}`;

  const displayTitle =
    title || `${category} ${type === "film" ? "Filmleri" : "Dizileri"}`;

  return (
    <div className="py-4 pr-4 pl-4 md:py-8 md:pl-12">
      <div className="mb-4 flex items-end justify-between px-2">
        <h2 className="text-lg font-semibold text-white md:text-2xl lg:text-3xl">
          {displayTitle}
        </h2>

        <Link
          href={listUrl}
          className="text-primary-100/70 text-sm font-medium duration-200 hover:text-white hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>
      <ContentSlider items={contents} />
    </div>
  );
};

export default ContentRow;
