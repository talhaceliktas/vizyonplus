import { getComments } from "@/features/admin/services/commentsService";
import CommentsClient from "@/features/admin/components/comments/CommentsClient";

export const metadata = {
  title: "Yorum Yönetimi | Admin",
};

export const revalidate = 0; // Her girişte taze veri (Admin paneli için önemli)

interface PageProps {
  params: { [key: string]: string | string[] | undefined };
}

export default async function YorumlarPage({ params }: PageProps) {
  // 1. URL'den sayfa numarasını al (Yoksa 1)
  const searchParams = await params;

  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1;
  const PAGE_SIZE = 10;

  // 2. Veriyi sunucuda çek
  const { data, count } = await getComments(page, PAGE_SIZE);

  // 3. Client bileşenine gönder
  return (
    <div className="animate-in fade-in pb-10 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Yorum Yönetimi</h2>
        <p className="text-neutral-400">
          Kullanıcılar tarafından yapılan tüm yorumları inceleyin ve yönetin.
        </p>
      </div>

      <CommentsClient
        initialComments={data || []} // Gelen veri (any hatası alırsan types.ts kullan)
        totalCount={count || 0}
        currentPage={page}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
