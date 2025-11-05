import Footer from "./_components/Footer";
import Giris from "./_components/anasayfa/Giris";
import IcerikKutusu from "./_components/anasayfa/IcerikKutusu";

export default function Home() {
  return (
    <div>
      <Giris />
      <IcerikKutusu tur="film" kategori="Suç" />
      <IcerikKutusu tur="film" kategori="Aksiyon" />
      <Footer />
    </div>
  );
}
