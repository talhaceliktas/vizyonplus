import supabaseServerClient from "../../_lib/supabase/server";
import { profilBilgileriniGetir } from "../../_lib/data-service-server";
import ProfilAyarlari from "./ProfilAyarlari";
import SifreDegistir from "./SifreDegistir";
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

  const profilBilgileri = await profilBilgileriniGetir(user.id);

  return (
    <div className="flex-1 space-y-10">
      {/* --- KART 1: PROFİL BİLGİLERİ --- */}
      <div className="rounded-2xl border border-white/5 bg-[#121212] p-6 shadow-xl md:p-10">
        <h2 className="mb-8 border-b border-white/10 pb-4 text-2xl font-bold text-white">
          Kullanıcı Bilgilerim
        </h2>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/10 shadow-2xl transition-all hover:border-yellow-500/50 md:h-40 md:w-40">
              <AvatarYukle
                user={user}
                displayName={display_name}
                src={profilBilgileri.profil_fotografi}
              />
            </div>
            <p className="text-xs text-gray-500">
              Değiştirmek için resme tıkla
            </p>
          </div>

          {/* Sağ: Form */}
          <div className="w-full flex-1">
            <ProfilAyarlari user={user} profilBilgileri={profilBilgileri} />
          </div>
        </div>
      </div>

      {/* --- KART 2: GÜVENLİK --- */}
      <div className="rounded-2xl border border-white/5 bg-[#121212] p-6 shadow-xl md:p-10">
        <h2 className="mb-8 border-b border-white/10 pb-4 text-2xl font-bold text-white">
          Güvenlik ve Şifre
        </h2>
        <SifreDegistir />
      </div>
    </div>
  );
};

export default Ayarlar;
