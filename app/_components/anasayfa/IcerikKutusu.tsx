import { icerikleriGetir } from "../../_lib/data-service-server";
import IcerikSlider from "./IcerıkSlider";

const IcerikKutusu = async ({
  tur,
  kategori,
}: {
  tur: string;
  kategori: string;
}) => {
  const icerikler = await icerikleriGetir(tur, kategori);

  return (
    <div className="p-4">
      <IcerikSlider icerikler={icerikler} kategori={kategori} />
    </div>
  );
};

export default IcerikKutusu;
