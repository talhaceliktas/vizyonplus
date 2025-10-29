import { Suspense } from "react";
import ProfilYanMenu from "../../_components/profil/ProfilYanMenu";
import Yukleniyor from "../../_components/icerikler/Yukleniyor";
import Ayarlar from "../../_components/profil/Ayarlar";

const Page = () => {
  return (
    <div className="flex w-full gap-x-10">
      <ProfilYanMenu routeHref="/profil/ayarlar" />
      <div className="flex-1">
        <Suspense fallback={<Yukleniyor />}>
          <Ayarlar />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
