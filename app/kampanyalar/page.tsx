import { Suspense } from "react";
import Loading from "../loading";
import Footer from "../_components/Footer";
import { Metadata } from "next";
import KampanyaKarti from "../_components/KampanyaKarti"; // Yeni isim
import { kampanyalar } from "../data/kampanyalar";

export const metadata: Metadata = {
  title: "Vizyon+ | Kampanyalar",
  description: "Vizyon+'ın en güncel ve avantajlı kampanyalarını keşfedin.",
};

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="from-primary-950 via-primary-900 to-primary-950 relative min-h-screen overflow-hidden bg-gradient-to-b pt-48">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4">
          <div className="mb-16 text-center">
            <h1 className="from-primary-50 via-primary-100 to-primary-200 mb-4 bg-gradient-to-r bg-clip-text text-5xl font-black text-transparent md:text-6xl">
              Vizyon+ Kampanyaları
            </h1>
            <p className="text-primary-300 text-xl font-medium md:text-2xl">
              Sizin için en avantajlı fırsatlar burada!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {kampanyalar.map((kampanya, index) => (
              <KampanyaKarti
                key={index}
                baslik={kampanya.baslik}
                aciklama={kampanya.aciklama}
                ikon={kampanya.ikon}
                link={kampanya.link}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </Suspense>
  );
};

export default Page;
