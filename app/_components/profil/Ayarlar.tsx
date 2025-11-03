import supabaseServerClient from "../../_lib/supabase/server";
import { profilFotografiniGetir } from "../../_lib/data-service-server";
import ProfilAyarlari from "./ProfilAyarlari";
import { FaRegAddressCard } from "react-icons/fa";
import SifreDegistir from "./SifreDegistir";
import { IoMdUnlock } from "react-icons/io";
import AvatarYukle from "./AvatarYukle";

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
    <div className="flex flex-col gap-y-10 md:gap-y-20">
      <div className="border-primary-700 relative flex flex-col items-center justify-center gap-y-8 border-2 px-4 py-8 md:flex-row md:items-start md:gap-x-16">
        <div>
          <div className="border-primary-600 relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 md:h-52 md:w-52">
            <AvatarYukle
              user={user}
              displayName={display_name}
              src={kullaniciFotografi}
            />
          </div>
        </div>
        <h2 className="text-primary-50 absolute top-0 left-4 flex -translate-y-1/2 items-center gap-x-2 bg-[#eaeaea] px-4 md:left-10 md:gap-x-4 dark:bg-[#191919]">
          <FaRegAddressCard className="text-3xl md:text-4xl" />
          <p className="text-lg md:text-xl">Kullanıcı Bilgilerim</p>
        </h2>
        <ProfilAyarlari user={user} />
      </div>
      <div className="border-primary-700 relative flex justify-center border-2">
        <SifreDegistir user={user} />
        <h2 className="text-primary-50 absolute top-0 left-4 flex -translate-y-1/2 items-center gap-x-2 bg-[#eaeaea] px-4 md:left-10 md:gap-x-4 dark:bg-[#191919]">
          <IoMdUnlock className="text-3xl md:text-4xl" />
          <p className="text-lg md:text-xl">Şifre Değiştir</p>
        </h2>
      </div>
    </div>
  );
};

export default Ayarlar;
