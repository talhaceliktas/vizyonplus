import Image from "next/image";
import supabaseServerClient from "../../_lib/supabase/server";
import { profilFotografiniGetir } from "../../_lib/data-service-server";
import ProfilAyarlari from "./ProfilAyarlari";
import { FaRegAddressCard } from "react-icons/fa";
import SifreDegistir from "./SifreDegistir";

const Ayarlar = async () => {
  const supabase = await supabaseServerClient();

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    throw new Error("User not found");
  }

  const {
    user_metadata: { display_name },
  } = user;

  const kullaniciFotografi = await profilFotografiniGetir(user.id);

  return (
    <div className="flex flex-col">
      <div className="border-primary-700 relative flex flex-col items-center justify-center gap-y-8 border-2 px-2 py-8 md:flex-row md:items-start md:gap-x-16">
        <div className="border-primary-600 relative h-52 w-52 shrink-0 overflow-hidden rounded-full border-4">
          <Image
            alt={`${display_name || "Kullanıcı"} fotoğrafı`}
            src={kullaniciFotografi || "/default-user.jpg"}
            fill
            className="object-cover"
          />
        </div>
        <h2 className="absolute top-0 left-10 flex -translate-y-1/2 items-center gap-x-4 bg-[#191919] px-4">
          <FaRegAddressCard className="text-4xl" />
          <p className="text-xl">Kullanıcı Bilgilerim</p>
        </h2>
        <ProfilAyarlari user={user} />
      </div>
      <SifreDegistir user={user} />
    </div>
  );
};

export default Ayarlar;
